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
    role: z.nativeEnum(Role, { message: "Role must be either Recruiter or Candidate." })
});


export const signinValidation = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export const jobValidation = z.object({
    title: z.string().min(5, { message: "Job title must be at least 5 characters long." }),
    description: z.string().min(10, { message: "Job description must be at least 10 characters long." }),
    jobRole: z.string().min(1, { message: "Job Role must Required" }),
    location: z.string().min(1, { message: "Location is required." }),
    isOpen: z.boolean().default(true).optional(),
    type: z.nativeEnum(jobType, { message: "Job type must be either 'On Site' or 'Work From Home'." }),
    requirement: z.string().min(1, { message: "Job requirement is required." }),
    companyId: z.string().min(1, { message: "CompanyId is required." })
});

export const companyValidation = z.object({
    name: z.string().min(1, { message: "Company name must be at least 1 characters long." }),
    logo: z.string().min(1, { message: "logo required in png format" }),
});

enum applicationStatus {
    Rejected = "Rejected",
    Applied = "Applied",
    Interviewing = "Interviewing",
    Hired = "Hired"
}

export const applicationValidation = z.object({
    education: z.string().min(1, { message: "Education is required." }),
    experience: z.string(),
    skills: z.string().min(1, { message: "Skills are required." }),
    resume: z.string().min(1, { message: "Resume is required." }),
    status: z.nativeEnum(applicationStatus, { message: "Invalid application status." }).default(applicationStatus.Applied)
})

export const statusValidation = z.object({
    applicationId: z.string().min(1, { message: "Id is Required" }),
    status: z.nativeEnum(applicationStatus, { message: "Invalid application status." }).default(applicationStatus.Applied)
})
