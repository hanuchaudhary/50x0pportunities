import { create } from "zustand";
import axios from "axios";
import { WEB_URL } from "@/Config";
import { getAuthHeaders, Job } from "@/store/profileState";

interface JobsStore {
  jobs: Job[];
  loading: boolean;
  fetchJobs: (filter: string) => Promise<void>;
}

export const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  loading: false,
  fetchJobs: async (filter: string) => {
    const { Authorization } = getAuthHeaders();
    set({ loading: true });
    try {
      const response = await axios.get(`${WEB_URL}/api/v1/job/bulk?filter=${filter}`, {
        headers: {
          Authorization,
        },
      });
      set({ jobs: response.data.jobs });
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
