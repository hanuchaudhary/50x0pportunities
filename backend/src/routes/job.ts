import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { jobValidation } from "@hanuchaudhary/job";
import { Job } from "../helper/types";

export const jobRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string,
    },
}>();

jobRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";

    try {
        const token = authHeader.split(" ")[1];
        const userVerify = await verify(token, c.env.JWT_SECRET);

        if (userVerify) {
            c.set("userId", userVerify.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({ msg: "Invalid token!!!" });
        }

    } catch (err) {
        c.status(403);
        return c.json({ msg: "Invalid or expired token!!!" });
    }
});

jobRouter.post("/create", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { title, description, experience, location, isOpen, jobType, requirement, companyId, createdAt, position, salaryFrom, salaryTo, skills }: Job = await c.req.json();

        const { success, error } = jobValidation.safeParse({ title, description, experience, location, isOpen, jobType, requirement, companyId, createdAt, position, salaryFrom, salaryTo, skills });
        if (!success) {
            return c.json({
                success: false,
                message: 'Validation Error',
                error: error.errors,
            }, 400);
        }

        const userId = c.get("userId");

        const recruiter = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "Recruiter",
            },
        });

        if (!recruiter) {
            return c.json({
                success: false,
                message: 'Recruiter not found',
            }, 404);
        }


        const job = await prisma.job.create({
            data: {
                title,
                description,
                location,
                isOpen,
                requirement,
                recruiterId: recruiter.id,
                companyId,
                createdAt,
                position,
                salaryFrom,
                salaryTo,
                skills,
                jobType: jobType as any,
            }
        });

        return c.json({
            success: true,
            message: 'Job created successfully',
            createdJob: job
        }, 201);

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during job creation',
            error: error.message,
        }, 500);
    }
});

//fetch jobs-------
jobRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const filter = c.req.query("filter") || "";
        const jobs = await prisma.job.findMany({
            where: {
                OR: [{ title: { contains: filter, mode: "insensitive" } },
                { location: { contains: filter, mode: "insensitive" } },
                { companyId: { contains: filter, mode: "insensitive" } }
                ],
            },
            orderBy: {
                createdAt: "desc"
            }, select: {
                id: true,
                recruiterId: true,
                title: true,
                description: true,
                location: true,
                jobType: true,
                requirement: true,
                position: true,
                isOpen: true,
                createdAt: true,
                salaryFrom: true,
                salaryTo: true,
                skills: true,
                company: {
                    select: {
                        id: true,
                        logo: true,
                        name: true
                    }
                }
            }
        })

        return c.json({
            jobs
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching jobs',
            error: error.message,
        }, 500);
    }
})

jobRouter.get("/created", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const jobs = await prisma.job.findMany({
            where: {
                recruiterId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                jobApplication: {
                    include: {
                        applicant: {
                            select: {
                                fullName: true,
                                email: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })

        return c.json({
            success: true,
            message: "Jobs fetched successfully",
            jobs
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching jobs',
            error: error.message,
        }, 500);
    }
});

jobRouter.get("/saved", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const jobs = await prisma.savedJobs.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            }
        })

        return c.json({
            success: true,
            message: "Jobs fetched successfully",
            jobs
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching jobs',
            error: error.message,
        }, 500);
    }
});

jobRouter.get("/isApplied/:jobId", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const jobId = c.req.param("jobId");

        const jobApplication = await prisma.jobApplication.findFirst({
            where: {
                applicantId: userId,
                jobId: jobId
            }
        })

        return c.json({
            success: true,
            message: "Job fetched successfully",
            isApplied: !!jobApplication
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching job',
            error: error.message,
        }, 500);
    }
})

jobRouter.get("/applied", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const appliedJobs = await prisma.jobApplication.findMany({
            where: {
                applicantId: userId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                job: {
                    include: {
                        company: true,
                    }
                }
            }
        })

        return c.json({
            success: true,
            message: "Jobs fetched successfully",
            appliedJobs
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching jobs',
            error: error.message,
        }, 500);
    }
});

jobRouter.get("/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const id = c.req.param("id");
        const job = await prisma.job.findUnique({
            where: {
                id: id
            }, include: {
                jobApplication: {
                    include: {
                        applicant: {
                            select: {
                                fullName: true,
                                email: true,
                                id: true
                            }
                        }
                    }
                },
                company: true
            }
        })

        return c.json({
            success: true,
            message: "job fetched successfully",
            job
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching job',
            error: error.message,
        }, 500);
    }
})
//fetch jobs-------

jobRouter.post("/delete", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { id } = await c.req.json();

        const job = await prisma.job.delete({
            where: {
                id: id
            }
        })

        return c.json({
            success: true,
            message: "Job deleted successfully",
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Error While Deleting the Job',
            error: error.message,
        }, 500);
    }
})

jobRouter.put("/open", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { jobId, isOpenValue }: { jobId: string; isOpenValue: boolean } = await c.req.json();

        if (!jobId) {
            return c.json({
                success: false,
                message: "JobId does not exist",
            }, 400);
        }

        if (typeof isOpenValue !== "boolean") {
            return c.json({
                success: false,
                message: "isOpenValue must be a boolean",
            }, 400);
        }

        await prisma.job.update({
            where: {
                id: jobId,
            },
            data: {
                isOpen: isOpenValue,
            },
        });

        return c.json({
            success: true,
            message: "Job updated successfully",
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Error while updating the job',
            error: error.message,
        }, 500);
    }
});

//saved jobs route
jobRouter.post("/save", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const { jobId } = await c.req.json();

        if (!jobId) {
            return c.json({
                success: false,
                message: "Job ID is required",
            }, 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return c.json({
                success: false,
                message: "User not found",
            }, 404);
        }

        if (user.role !== "Candidate") {
            return c.json({
                success: false,
                message: "Only Candidates can save jobs",
            }, 403);
        }

        const jobExists = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!jobExists) {
            return c.json({
                success: false,
                message: "Job does not exist",
            }, 404);
        }

        const existingJob = await prisma.savedJobs.findFirst({
            where: { userId, jobId },
        });

        if (existingJob) {
            await prisma.savedJobs.delete({
                where: { id: existingJob.id },
            });

            return c.json({
                success: true,
                message: "Job unsaved successfully",
                jobId,
            }, 200);
        }

        const savedJob = await prisma.savedJobs.create({
            data: { userId, jobId },
        });

        return c.json({
            success: true,
            message: "Job saved successfully",
            savedJob,
        }, 201);

    } catch (error: any) {
        console.error("Error saving job:", error);

        return c.json({
            success: false,
            message: "Server error during saving job",
            error: error.message,
        }, 500);
    } finally {
        await prisma.$disconnect();
    }
});
