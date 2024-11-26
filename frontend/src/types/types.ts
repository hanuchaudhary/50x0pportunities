
export enum Role {
    Candidate = "Candidate",
    Recruiter = "Recruiter",
}

export enum JobType {
    OnSite = "On Site",
    WorkFromHome = "Work From Home",
}

export interface Company {
    id: string
    logo: string;
    name: string;
}

export enum ApplicationStatus {
    Rejected = "Rejected",
    Applied = "Applied",
    Interviewing = "Interviewing",
    Hired = "Hired",
}

export interface JobApplication {
    id: string;
    title: string;
    education: string;
    experience: string;
    skills: string;
    status: ApplicationStatus;
    createdAt: string;
    job: Job;
    company: Company;
}

export interface Job {
    id: string;
    recruiterId: string;
    companyId: string;
    jobRole: string;
    title: string;
    description: string;
    location: string;
    type: JobType;
    requirement: string;
    isOpen: boolean;
    createdAt: string;
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
}