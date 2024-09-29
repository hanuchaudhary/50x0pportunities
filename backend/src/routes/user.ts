import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify, sign, jwt } from "hono/jwt";
import { signinValidation, signupValidation } from '../Validation';
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
    if (path.includes("/signin") || path.includes("/signup")) {
        await next();
        return;
    }
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



userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const { email, password, fullName , role } = await c.req.json();

        const validation = signupValidation.safeParse({ email, password, fullName , role });

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
                id: true,
                fullName: true,
                email: true,
                role: true
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
                fullName,
                role
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true
            },
        });

        const data = { id: user.id, email: user.email, name: user.fullName }
        const token = await Jwt.sign(data, c.env.JWT_SECRET)

        return c.json({
            success: true,
            message: 'User created successfully',
            user,
            token,
        }, 201);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during user creation',
            error: error.message,
        }, 500);
    }
});

// User Signin
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
            user: {
                id: user.id,
                email: user.email,
                name: user.fullName,
            },
        }, 200);
    } catch (error: any) {
        return c.json({
            success: false,
            message: 'Server error during user signin',
            error: error.message,
        }, 500);
    }
});

// Fetch bulk users
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
                fullName: true,
                email: true,
                role : true,
                jobApplication: true,
                createdJobs : true
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


// Delete a user
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

// Update user details
userRouter.put('/update', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const userId = c.get("userId");
        const { name, password } = await c.req.json();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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




export default userRouter;
