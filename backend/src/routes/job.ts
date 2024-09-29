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
        const userVerify = await verify(authHeader, c.env.JWT_SECRET);

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
        const { title, description, location, isOpen, type, requirement } = await c.req.json();

        const { success, error } = jobValidation.safeParse({ title, description, location, isOpen, type, requirement });
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
                title: title,
                description: description,
                type: type,
                requirement: requirement,
                location: location,
                isOpen: isOpen,
                recruiterId: recruiter.id,
            },
        });

        return c.json({
            success: true,
            message: 'Job created successfully',
            job,
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
                { location: { contains: filter, mode: "insensitive" } }],
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return c.json({
            success: true,
            message: "jobs fetched successfully",
            jobs: jobs
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
            where : {
                id : id
            }
        })

        return c.json({
            success: true,
            message: "job fetched successfully",
            job: job
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching job',
            error: error.message,
        }, 500);
    }
})