import { create } from "zustand";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { ApplicationStatus, Company, Job, JobApplication } from "@/types/types";
import { getAuthHeaders } from "./profileState";


export interface CreatedJobs extends Job {
    jobApplication: JobApplication[];

}

interface CreatedJobsStore {
    createdJobs: CreatedJobs[];
    loading: boolean;
    fetchCreatedJobs: () => Promise<void>;
}

export const useCreatedJobsStore = create<CreatedJobsStore>((set) => ({
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
    jobId : string;
    createdAt : string;
    status : ApplicationStatus
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
