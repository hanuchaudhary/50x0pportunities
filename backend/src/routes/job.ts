import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { jobValidation } from "../Validation";

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
        const { title, description, jobRole, location, isOpen, type, requirement, companyId } = await c.req.json();

        const { success, error } = jobValidation.safeParse({ title, jobRole, description, location, isOpen, type, requirement, companyId });
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
                type,
                requirement,
                recruiterId: recruiter.id,
                companyId: companyId,
                jobRole
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
                type: true,
                requirement: true,
                jobRole: true,
                isOpen: true,
                createdAt: true,
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
                message: "Job ID is required"
            }, 400);
        }

        const user = await prisma.user.findUnique({
            where :{
                id:  userId,
            }
        })

        if (user?.role != "Candidate") {
            return c.json({
                success : false,
                message : "Only Candidate can Save Jobs",
            },403)
        }

        const existJob = await prisma.savedJobs.findFirst({
            where: {
                userId, jobId
            }
        });

        if (existJob) {
            await prisma.savedJobs.delete({
                where: {
                    id: existJob.id
                }
            })

            return c.json({
                success : true,
                message : "Job Unsaved",
            })
        }

        const saveJob = await prisma.savedJobs.create({
            data: {
                jobId, userId
            }
        })

        return c.json({
            success: true,
            message: "Job saved successfully",
            saveJob
        }, 201);

    } catch (error: any) {
        return c.json({
            success: false,
            message: "Server error during saving job",
            error: error.message,
        }, 500);
    }
});
