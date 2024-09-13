const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { signupValidation, signinValidation } = require("../Validation/userValidation");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const userRouter = express.Router();
const client = new PrismaClient();
userRouter.use(express.json())

const HTTP_OK = parseInt(process.env.HTTP_OK, 10)
const HTTP_BAD_REQUEST = parseInt(process.env.HTTP_BAD_REQUEST, 10) || 400;
const HTTP_UNAUTHORIZED = parseInt(process.env.HTTP_UNAUTHORIZED, 10) || 401;
const HTTP_CREATED = parseInt(process.env.HTTP_CREATED, 10) || 201;

userRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;

    const validateUser = signupValidation.safeParse(body);
    if (!validateUser.success) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: "Zod Validation error!!!",
        errors: validateUser.error.issues
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const createUser = {
      email: body.email,
      name: body.name,
      password: hashedPassword
    }
    const user = await client.userModel.create({
      data: createUser,
      select: {
        email: true,
        id: true
      }
    });

    //jsonwebtoken
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

    return res.status(HTTP_CREATED).json({
      success: true,
      message: "User Created Successfully!!!",
      user: user,
      token: token
    });

  } catch (error) {
    return res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: "Signup Failed!!!",
      error: error.message
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const body = req.body;
    const validateUser = signinValidation.safeParse(body);
    if (!validateUser.success) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: "Zod Validation error!!!",
        errors: validateUser.error.issues
      });
    }

    const user = await client.userModel.findUnique({
      where: {
        email: body.email
      },
      select: {
        password: true,
        email: true,
        id: true
      }
    })

    if (!user) {
      return res.status(HTTP_BAD_REQUEST).json({
        message: "User not Exists!!"
      })
    }


    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

    // Check password
    const unhashPassword = await bcrypt.compare(body.password, user.password);
    if (!unhashPassword) {
      return res.status(HTTP_UNAUTHORIZED).json({
        success: false,
        message: "Incorrect password!!!"
      });
    }

    return res.status(HTTP_OK).json({
      success: true,
      message: "Login Successfully!!!",
      user: {
        email : user.email,
        id : user.id
      },
      token: token
    })


  } catch (error) {
    res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: "Signin Failed!!!",
      error: error.message
    });
  }
})

userRouter.post("/remove", async (req, res) => {
  try {
    const body = req.body;
    const deletedUser = await client.userModel.delete({
      where: {
        email: body.email
      },
      select: {
        email: true, password: true
      }
    });

    return res.status(HTTP_OK).json({
      success: true,
      message: "User removed successfully",
      deletedUser: deletedUser
    });

  } catch (error) {
    return res.status(HTTP_BAD_REQUEST).json({
      success: false,
      message: "User removal failed",
      error: error.message
    });
  }
});

userRouter.get("/allusers", async (req, res) => {
  const AllUsers = await client.userModel.findMany({
    select: {
      id: true,
      email: true,
      password: true
    }
  })

  return res.status(HTTP_OK).json({
    data: AllUsers
  })

})

// userRouter.get("/user", async (req, res) => {
//   const user = client.userModel.findUnique(id)
// })

module.exports = { userRouter };
