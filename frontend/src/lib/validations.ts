import z from "zod";

enum jobType {
  onSite = "onsite",
  workFromHome = "workfromhome"
}

export const signupValidation = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  role: z.enum(["Candidate", "Recruiter"], { message: "Role must be either Recruiter or Candidate." })
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

enum Education {
  HighSchool = "High School",
  Bachelors = "Bachelors",
  Masters = "Masters",
  Doctorate = "Doctorate"
}

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(50, {
      message: "Full name must not exceed 50 characters.",
    }),

  skills: z
    .string()
    .min(2, {
      message: "Skills must be at least 2 characters.",
    })
    .max(100, {
      message: "Skills must not exceed 100 characters.",
    }),

  avatar: z
    .instanceof(File, {
      message: "Invalid file type for avatar. Please upload an image.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Avatar must be an image file.",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Avatar must be less than 5MB.",
    }),

  resume: z
    .instanceof(File, {
      message: "Invalid file type for resume. Please upload a PDF.",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Resume must be a PDF document.",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Resume must be less than 10MB.",
    }),

  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  education: z.nativeEnum(Education, { message: "Invalid education level." }),
  experience: z.string().min(1, { message: "Experience is required." }),
});
