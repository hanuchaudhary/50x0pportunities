
export enum Role {
    Candidate = "Candidate",
    Recruiter = "Recruiter",
}

enum JobType {
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

export interface Company {
    id: string
    logo: string;
    name: string;
}

export interface _count {
    createdJobs: number
    jobApplication: number
    savedJobs: number
}

export enum ApplicationStatus {
    Rejected = "Rejected",
    Applied = "Applied",
    Interviewing = "Interviewing",
    Hired = "Hired",
}
export interface JobApplication {
    id: string;
    applicantId: string;
    jobId: string;
    status: string;
    isApplied: boolean;
    createdAt: string;
    applicant: {
      id: string;
      fullName: string;
      email: string;
      experience: string;
      education: string;
      skills: string;
      resume: string;
      bio: string;
      avatar: string;
      role: string;
    };
  }  

export interface Job {
    id: string;
    title: string;
    companyId?: string | null;
    position: string;
    description: string;
    skills: string;
    location: string;
    experience: number;
    package: string;
    jobType: JobType;
    salaryFrom: string;
    salaryTo: string;
    requirement: string;
    isOpen: boolean;
    createdAt: Date;
}


export interface User {
    id: string;
    email: string;
    fullName: string;
    experience: string;
    education: string;
    resume: string;
    avatar: string;
    bio: string;
    skills: string;
    role: Role;
    _count?: _count;
}