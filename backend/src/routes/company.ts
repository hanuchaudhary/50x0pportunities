import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { companyValidation } from "@hanuchaudhary/job";

export const companyRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string,
    },
}>();

companyRouter.use("/*", async (c, next) => {
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


companyRouter.post("/create", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const { name, logo } = await c.req.json();
        const { success, error } = companyValidation.safeParse({ name, logo })
        if (!success) {
            return c.json({
                success: false,
                message: "Company validation error",
                error: error
            }, 400)
        }
        const existCompany = await prisma.company.findFirst({
            where: {
                name: name
            }
        })
        if (existCompany) {
            return c.json({
                success: false,
                message: "Company Already exists with this name",
            }, 400)
        }

        const company = await prisma.company.create({
            data: {
                name: name,
                logo: logo
            }
        })

        return c.json({
            success: true,
            message: "Company created successfully",
            company
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during creating company',
            error: error.message,
        }, 500);
    }
})

companyRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const companies = await prisma.company.findMany(
            {
                orderBy: {
                    name: "asc"
                }
            }
        );

        return c.json({
            success: true,
            message: "Companies fetched successfully",
            companies
        }, 200)

    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during fetching companies',
            error: error.message,
        }, 500);
    }
})

