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
        const { title, description, location, isOpen, type, requirement, companyId } = await c.req.json();

        const { success, error } = jobValidation.safeParse({ title, description, location, isOpen, type, requirement, companyId });
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
                companyId: companyId
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

jobRouter.post("/saved", async (c) => {
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

        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return c.json({
                success: false,
                message: "Job not found"
            }, 404);
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                role: "Recruiter"
            }
        })

        if (user) {
            return c.json({
                success: false,
                message: "Only Candidate can Save Jobs"
            }, 400);
        }


        const alreadySaved = await prisma.savedJobs.findFirst({
            where: {
                jobId: jobId,
                userId: userId,
            }
        });

        if (alreadySaved) {
            return c.json({
                success: false,
                message: "Job is already saved"
            }, 409);
        }

        const savedJob = await prisma.savedJobs.create({
            data: {
                jobId: jobId,
                userId: userId
            }, include: {
                job: true
            }
        });

        return c.json({
            success: true,
            message: "Job saved successfully",
            savedJob
        }, 201);

    } catch (error: any) {
        return c.json({
            success: false,
            message: "Server error during saving job",
            error: error.message,
        }, 500);
    }
});

jobRouter.post("/removesave", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { id } = await c.req.json();
        console.log(id);

        const savedJobExist = await prisma.savedJobs.findUnique({
            where: {
                id: id
            }
        })

        console.log(savedJobExist);

        if (!savedJobExist) {
            return c.json({
                success: false,
                message: "Saved Job Not Exists",
            }, 400);
        }

        const respo = await prisma.savedJobs.delete({
            where: {
                id: id
            }
        })

        return c.json({
            success: true,
            message: "Removed Saved Job"
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: "Server error during removing saved job",
            error: error,
        }, 500);
    }
})

