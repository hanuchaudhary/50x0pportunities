export interface Job {
    id: string;
    title: string;
    companyId?: string | null;
    position: string;
    description: string;
    skills: string;
    location: string;
    experience: string;
    package: string;
    jobType: JobType;
    salaryFrom: string;
    salaryTo: string;
    requirement: string;
    isOpen: boolean;
    createdAt: Date;
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