import z from "zod";

enum Role {
    Recruiter = "Recruiter",
    Candidate = "Candidate"
}

enum jobType {
    onSite = "onsite",
    workFromHome = "workfromhome"
}

export const signupValidation = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
    fullName: z.string().min(1, { message: "Full name is required." }),
    role: z.nativeEnum(Role, { message: "Role must be either Recruiter or Candidate." })
});

 
export const signinValidation = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export const jobValidation = z.object({
    title: z.string().min(5, { message: "Job title must be at least 5 characters long." }),
    description: z.string().min(10, { message: "Job description must be at least 10 characters long." }),
    location: z.string().min(1, { message: "Location is required." }),
    isOpen: z.boolean().default(true).optional(),
    type: z.nativeEnum(jobType, { message: "Job type must be either 'On Site' or 'Work From Home'." }),
    requirement: z.string().min(1, { message: "Job requirement is required." })
});
