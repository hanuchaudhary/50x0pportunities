import { WEB_URL } from "@/Config";
import axios from "axios";
import { create } from "zustand";
import { getAuthHeaders } from "./profileState";

interface UserJobCountDataState {
    createdJobCount: number;
    appliedJobCount: number;
    savedJobCount: number;
    fetchJobCount: () => void;
}

export const useJobCountDataStore = create<UserJobCountDataState>((set) => ({
    appliedJobCount: 0,
    createdJobCount: 0,
    savedJobCount: 0,
    fetchJobCount: async () => {
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/user/job-count`, {
                headers: getAuthHeaders()
            });
            const data = response.data.userJobCount;
            set({ createdJobCount: data.createdJobs, appliedJobCount: data.appliedJobs, savedJobCount: data.savedJobs });
        } catch (error) {
            console.error(error);
        }
    }
}));