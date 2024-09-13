const zod = require("zod");

// Signup validation
const signupValidation = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  name: zod.string().min(1, { message: "Name must have atleast 1 character" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Signin validation
const signinValidation = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  password: zod.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Export the validation schemas
module.exports = {
  signupValidation,
  signinValidation
};
