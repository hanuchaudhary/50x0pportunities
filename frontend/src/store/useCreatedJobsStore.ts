import { create } from "zustand";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { ApplicationStatus, Company, Job } from "@/types/types";
import { getAuthHeaders } from "./profileState";


export interface CreatedJobs {
    id: string;
    title: string;
    companyId?: string | null;
    position: string;
    description: string;
    skills: string;
    location: string;
    experience: number;
    package: string;
    jobType: string;
    salaryFrom: string;
    salaryTo: string;
    requirement: string;
    isOpen: boolean;
    createdAt: string;
    company: Company;
    _count: {
        jobApplication: number;
    };
}

interface CreatedJobsStore {
    createdJobs: CreatedJobs[];
    loading: boolean;
    fetchCreatedJobs: () => Promise<void>;
    updateJobStatus: (jobId: string, isOpen: boolean) => Promise<void>;
    deleteJob: (jobId: string) => Promise<void>;
}

export const useCreatedJobsStore = create<CreatedJobsStore>((set, get) => ({
    createdJobs: [],
    loading: false,
    fetchCreatedJobs: async () => {
        const { Authorization } = getAuthHeaders();
        set({ loading: true });
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/job/created`, {
                headers: {
                    Authorization,
                },
            });
            set({ createdJobs: response.data.jobs });
        } catch (error) {
            console.error("Failed to fetch created jobs:", error);
        } finally {
            set({ loading: false });
        }
    },
    updateJobStatus: async (jobId, isOpen) => {
        const { Authorization } = getAuthHeaders();
        try {
            await axios.put(
                `${WEB_URL}/api/v1/job/open`,
                {
                    jobId,
                    isOpen,
                },
                {
                    headers: {
                        Authorization,
                    },
                }
            );

            const updatedJobs = get().createdJobs.map((job) =>
                job.id === jobId ? { ...job, isOpen } : job
            );
            set({ createdJobs: updatedJobs });

        } catch (error) {
            console.error("Failed to update job status:", error);
        }
    },
    deleteJob: async (jobId) => {
        const { Authorization } = getAuthHeaders();
        try {
            await axios.delete(`${WEB_URL}/api/v1/job/delete/${jobId}`, {
                headers: {
                    Authorization,
                },
            });
            const updatedJobs = get().createdJobs.filter((job) => job.id !== jobId);
            // const updatedCount = get().createdJobs.find((job) => job.id === jobId)?._count.jobApplication;
            set({ createdJobs: updatedJobs });

        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    },
}));

interface extendedJob extends Job {
    company: Company;
}

export interface savedJob {
    id: string;
    createdAt: string;
    jobId: string;
    userId: string;
    job: extendedJob;
}

interface savedJobsStore {
    savedJobs: savedJob[];
    loading: boolean;
    fetchSavedJobs: () => Promise<void>;
}

export const useSavedJobsStore = create<savedJobsStore>((set) => ({
    savedJobs: [],
    loading: false,
    fetchSavedJobs: async () => {
        const { Authorization } = getAuthHeaders();
        set({ loading: true });
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/job/saved`, {
                headers: {
                    Authorization,
                },
            });
            set({ savedJobs: response.data.jobs });
        } catch (error) {
            console.error("Failed to fetch saved jobs:", error);
        } finally {
            set({ loading: false });
        }
    },
}));

export interface appliedJob {
    id: string;
    jobId: string;
    createdAt: string;
    status: ApplicationStatus
    job: extendedJob;
}

interface appliedJobsStore {
    appliedJobs: appliedJob[];
    loading: boolean;
    fetchAppliedJobs: () => Promise<void>;
}


export const useAppliedJobsStore = create<appliedJobsStore>((set) => ({
    appliedJobs: [],
    loading: false,
    fetchAppliedJobs: async () => {
        const { Authorization } = getAuthHeaders();
        set({ loading: true });
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/job/applied`, {
                headers: {
                    Authorization,
                },
            });
            set({ appliedJobs: response.data.appliedJobs });
        } catch (error) {
            console.error("Failed to fetch applied jobs:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
