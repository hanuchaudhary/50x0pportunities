import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { applicationValidation, signinValidation, signupValidation, statusValidation } from '@hanuchaudhary/job';
import { Jwt } from 'hono/utils/jwt';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string,
    },

}>();

userRouter.use("/*", async (c, next) => {
    const path = c.req.url;
    if (path.includes("/signin") || path.includes("/signup") || path.includes("/forgot-password") || path.includes("/set-password")) {
        await next();
        return;
    }
    const authHeader = c.req.header("authorization") || "";

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    try {
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


userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const { email, password, role } = await c.req.json();

        const validation = signupValidation.safeParse({ email, password, role });

        if (!validation.success) {
            return c.json({
                success: false,
                message: 'Validation Error',
                error: validation.error.errors,
            }, 400);
        }

        const userExist = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
            },
        });

        if (userExist) {
            return c.json({
                success: false,
                message: 'User already exists',
            }, 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                fullName: ""
            },
            select: {
                id: true,
                email: true,
                role: true
            },
        });

        const data = { id: user.id, email: user.email }
        const token = await Jwt.sign(data, c.env.JWT_SECRET)

        return c.json({
            success: true,
            message: 'User created successfully',
            user,
            token,
        }, 201);
    } catch (error: any) {
        console.log("error", error);

        return c.json({
            success: false,
            message: 'Server error during user creation',
            error: error.message,
        }, 500);
    }
});

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const { email, password } = await c.req.json();

        const validation = signinValidation.safeParse({ email, password });
        if (!validation.success) {
            return c.json({
                success: false,
                message: 'Validation Error',
                error: validation.error.errors,
            }, 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                email: true,
                id: true,
                fullName: true,
                password: true,
                role: true
            },
        });

        if (!user) {
            return c.json({
                success: false,
                message: 'User not found',
            }, 409);
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return c.json({
                success: false,
                message: 'Password does not match',
            }, 401);
        }

        const data = { id: user.id, email: user.email, name: user.fullName }
        const token = await Jwt.sign(data, c.env.JWT_SECRET)
        return c.json({
            success: true,
            message: 'User signed in successfully',
            token,
            user : {
                email,
            }
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during user signin',
            error: error.message,
        }, 500);
    }
});

userRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const filter = c.req.query('filter') || '';

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { fullName: { contains: filter, mode: 'insensitive' } },
                    { email: { contains: filter, mode: 'insensitive' } },
                ],
            }
        });

        return c.json({
            success: true,
            message: 'Users fetched successfully',
            users,
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching users',
            error: error.message,
        }, 500);
    }
});

userRouter.get('/me', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                skills: true,
                bio: true,
                avatar: true,
                resume: true,
                education: true,
                experience: true,
                _count: {
                    select: {
                        createdJobs: true,
                        jobApplication: true,
                        savedJobs: true
                    }
                }
            },
        });

        if (!user) {
            return c.json({
                success: false,
                message: 'User not found',
            }, 404);
        }

        return c.json({
            success: true,
            user,
        }, 200);

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching user',
            error: error.message,
        }, 500);
    }
});


userRouter.post('/remove', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const userId = c.get('userId');
        if (!userId) {
            return c.json({
                success: false,
                message: 'User ID is required',
            }, 400);
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return c.json({
            success: true,
            message: 'User deleted successfully',
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during deleting user',
            error: error.message,
        }, 500);
    }
});

// Update 
userRouter.put('/update-password', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const userId = c.get("userId");
        const { password } = await c.req.json();

        const updatedUser = await prisma.user.update({
            where: { id: userId, role: "Candidate" },
            data: {
                password
            }
        });

        return c.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser,
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during updating user',
            error: error.message,
        }, 500);
    }
});

userRouter.post('/forgot-password', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const { email } = await c.req.json();
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return c.json({
                success: false,
                message: 'Account not found with this email',
            }, 404);
        }

        return c.json({
            success: true,
            message: 'User Found',
        }, 201);

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during sending email',
            error: error.message,
        }, 500);
    }

}
);

userRouter.put('/set-password', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const { password , email} = await c.req.json();
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const newPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user?.id },
            data: {
                password: newPassword
            }
        });

        return c.json({
            success: true,
            message: 'Password updated successfully',
        }, 201);

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during sending email',
            error: error.message,
        }, 500);
    }

}
);

userRouter.put('/update-profile', async (c) => {
    const prisma = new PrismaClient({
        datasources: { db: { url: c.env.DATABASE_URL } },
    }).$extends(withAccelerate());

    try {
        const userId = c.get("userId");
        if (!userId) {
            return c.json({
                success: false,
                message: 'User ID is required',
            }, 400);
        }

        const formData = await c.req.formData();
        const fullName = formData.get('fullName') as string;
        const skills = formData.get('skills') as string;
        const bio = formData.get('bio') as string;
        const avatar = formData.get('avatarURL') as string;
        const resume = formData.get('resumeURL') as string;
        const education = formData.get('education') as string;
        const experience = formData.get('experience') as string;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                fullName,
                skills,
                bio,
                avatar,
                resume,
                education,
                experience
            },
        });

        return c.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser,
        }, 200);
    } catch (error: any) {
        console.error('Error during user update:', error);
        return c.json({
            success: false,
            message: 'Server error during updating user',
            error: error.message,
        }, 500);
    }
});

//applications routes---------------------------------------------------------

userRouter.post("/application/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { education, experience, skills, resume } = await c.req.json();
        const { success, error } = applicationValidation.safeParse({
            education,
            experience,
            skills,
            resume,
        });

        if (!success) {
            return c.json(
                {
                    success: false,
                    message: "Validation error",
                    error: error,

                },
                400
            );
        }

        const jobId = c.req.param("id");
        const job = await prisma.job.findUnique({
            where: {
                id: jobId || undefined,
            },
        });

        if (!job) {
            return c.json(
                {
                    success: false,
                    message: "Job not found",
                },
                401
            );
        }

        const userId = c.get("userId");
        const candidate = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "Candidate",
            },
        });

        if (!candidate) {
            return c.json(
                {
                    success: false,
                    message: "Only Candidate can create Apllications for Job",
                },
                404
            );
        }

        const existingApplication = await prisma.jobApplication.findFirst({
            where: {
                applicantId: candidate.id,
                jobId: job.id,
            },
        });

        if (existingApplication) {
            return c.json(
                {
                    success: false,
                    message: "You have already applied for this job.",
                },
                402
            );
        }

        const application = await prisma.jobApplication.create({
            data: {
                education,
                experience,
                resume,
                skills,
                applicantId: candidate.id,
                jobId: job?.id,
                status: 'Applied'
            }
        });

        return c.json(
            {
                success: true,
                message: "Application created successfully",
                application,
            },
            201
        );
    } catch (error: any) {
        return c.json(
            {
                success: false,
                message: "Server error during application creation",
                error: error.message,
            },
            500
        );
    }
});

userRouter.get("/allapplications/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const jobId = c.req.param("id");
        if (!jobId) {
            return c.json(
                { success: false, message: "Job ID is required" },
                400
            );
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return c.json(
                { success: false, message: "Job not found" },
                404
            );
        }

        const userId = c.get("userId");
        const recruiter = await prisma.user.findFirst({
            where: { id: userId, role: "Recruiter" },
        });

        if (!recruiter) {
            return c.json(
                { success: false, message: "Only Recruiters can view applications for this job" },
                403
            );
        }

        const allApplications = await prisma.jobApplication.findMany({
            where: { jobId: jobId },
            include: { applicant: true, job: true },
        });

        return c.json(
            {
                success: true,
                message: "Fetched applications successfully",
                applications: allApplications,
            },
            200
        );
    } catch (error: any) {
        return c.json(
            {
                success: false,
                message: "Server error during fetching applications",
                error: error.message,
            },
            500
        );
    }
});

//update status route

userRouter.put("/status", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { applicationId, status } = await c.req.json();
        const { success, error } = statusValidation.safeParse({ applicationId, status });

        if (!success) {
            return c.json({
                success: false,
                message: "Invalid input: Zod validation error",
                error: error.errors
            }, 400);
        }

        const userId = c.get("userId");
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "Recruiter"
            }
        });

        if (!user) {
            return c.json({
                success: false,
                message: "User not found or user is not a recruiter"
            }, 403);
        }

        const application = await prisma.jobApplication.findUnique({
            where: {
                id: applicationId
            }
        });

        if (!application) {
            return c.json({
                success: false,
                message: "Job application not found"
            }, 404);
        }

        const updatedStatus = await prisma.jobApplication.update({
            where: {
                id: application.id
            },
            data: {
                status: status
            }
        });

        return c.json({
            success: true,
            message: "Job application status updated successfully",
            updatedStatus
        }, 200);

    } catch (error: any) {
        console.error("Error updating job application status:", error);
        return c.json({
            success: false,
            message: "Server error occurred while updating the status",
            error: error.message
        }, 500);
    }
});
