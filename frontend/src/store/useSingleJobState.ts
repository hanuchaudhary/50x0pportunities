import { Company, Job } from "@/types/types";
import { create } from "zustand";
import { getAuthHeaders } from "./profileState";
import axios from "axios";
import { WEB_URL } from "@/Config";

interface singleJob extends Job {
    company: Company;
}

interface singleJobState {
    isLoading: boolean;
    fetchSingleJob: (id: string) => Promise<void>;
    singleJob: singleJob | null;
    error: string | null;
}

export const useSingleJobStore = create<singleJobState>((set) => ({
    singleJob: null,
    isLoading: false,
    error: null,
    fetchSingleJob: async (id) => {
        try {
            const { Authorization } = getAuthHeaders();
            set({ isLoading: true, error: null });
            const response = await axios.get(`${WEB_URL}/api/v1/job/${id}`, {
                headers: {
                    Authorization
                },
            });
            set({ singleJob: response.data.job as singleJob });
        } catch (error) {
            console.error("Error fetching the job:", error);
            set({ error: "Failed to fetch the job. Please try again later." });
        } finally {
            set({ isLoading: false });
        }
    }
}));
