import z from "zod";

enum Role {
  Recruiter = "Recruiter",
  Candidate = "Candidate"
}

enum applicationStatus {
  Rejected = "Rejected",
  Applied = "Applied",
  Interviewing = "Interviewing",
  Hired = "Hired"
}


enum jobType {
  FullTime = "FullTime",
  PartTime = "Part Time",
  Contract = "Contract",
  Internship = "Internship",
  Temporary = "Temporary",
  Volunteer = "Volunteer",
  Remote = "Remote",
  Freelance = "Freelance",
  Apprenticeship = "Apprenticeship",
  Seasonal = "Seasonal",
  Other = "Other",
}


enum Education {
  HighSchool = "High School",
  Bachelors = "Bachelors",
  Masters = "Masters",
  Doctorate = "Doctorate"
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
  position: z.string().min(1, { message: "Job position must Required" }),
  location: z.string().min(1, { message: "Location is required." }),
  isOpen: z.boolean().default(true).optional(),
  jobType: z.nativeEnum(jobType, { message: "Job type is required" }),
  salaryFrom: z.string().min(1, "Minimum salary is required"),
  salaryTo: z.string().min(1, "Maximum salary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.number().min(1, "Experience must be at least 1 year").max(50, "Experience must be less than 50 years"),
  requirement: z.string().min(1, { message: "Job requirement is required." }),
  companyId: z.string().min(1, { message: "CompanyId is required." })
});

export const companyValidation = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logo: z.string().url({
    message: "Please enter a valid URL for the company logo.",
  }),
});

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

export const editProfileValidation = z.object({
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
    .max(500, {
      message: "Skills must not exceed 500 characters.",
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

export type SignupType = z.infer<typeof signupValidation>;
export type SigninType = z.infer<typeof signinValidation>;
export type JobType = z.infer<typeof jobValidation>;
export type CompanyType = z.infer<typeof companyValidation>;
export type ApplicationType = z.infer<typeof applicationValidation>;
export type StatusType = z.infer<typeof statusValidation>;
export type EditProfileType = z.infer<typeof editProfileValidation>;
