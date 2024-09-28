import { PrismaClient } from "@prisma/client/edge";
import bcrypt from 'bcryptjs';
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


jobRouter.post("/create", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

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

        const recruiter = prisma.user.findUnique({

        })

        // const job = prisma.jobs.create({
        //     data: {
        //         jobTitle: title,
        //         description: description,
        //         type: type,
        //         requirement: requirement,
        //         location : location,
        //         isOpen : isOpen
        //     }
        // })

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during job creation',
            error: error.message,
        }, 500);
    }
})