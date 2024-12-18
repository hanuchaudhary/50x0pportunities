import { Company, Job } from "@/types/types";
import { create } from "zustand";
import { getAuthHeaders } from "./profileState";
import axios from "axios";
import { WEB_URL } from "@/Config";

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
    unsaveJob: (jobId: string) => Promise<void>;
    unsaveLoading: boolean;
}

export const useSavedJobsStore = create<savedJobsStore>((set, get) => ({
    savedJobs: [],
    loading: false,
    unsaveLoading: false,
    fetchSavedJobs: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/job/saved`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                },
            });
            set({ savedJobs: response.data.jobs });
        } catch (error) {
            console.error("Failed to fetch saved jobs:", error);
        } finally {
            set({ loading: false });
        }
    },
    unsaveJob: async (jobId) => {
        set({ unsaveLoading: true });
        const { Authorization } = getAuthHeaders();
        try {
            await axios.delete(`${WEB_URL}/api/v1/job/unsave/${jobId}`, {
                headers: {
                    Authorization,
                },
            });
            const updatedJobs = get().savedJobs.filter((job) => job.job.id !== jobId);
            set({ savedJobs: updatedJobs });
        } catch (error) {
            console.error("Failed to unsave job:", error);
        } finally {
            set({ unsaveLoading: false });
        }
    },
}));