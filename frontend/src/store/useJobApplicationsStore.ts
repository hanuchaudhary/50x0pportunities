
import { create } from 'zustand';
import axios from 'axios';
import { WEB_URL } from '@/Config';
import { JobApplication } from '@/types/types';

import { getAuthHeaders } from './profileState';

export interface jobApplicationsStore {
    applications: JobApplication[];
    loading: boolean;
    fetchJobApplications: (jobId: string) => Promise<void>;
    updateApplicationStatus: (applicationId: string, status: string) => Promise<void>;
}

export const useJobApplicationsStore = create<jobApplicationsStore>((set) => ({
    applications: [],
    loading: false,
    fetchJobApplications: async (jobId) => {
        const { Authorization } = getAuthHeaders();
        set({ loading: true });
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/job/applications/${jobId}`, {
                headers: {
                    Authorization,
                },
            });
            set({ applications: response.data.applications });
        } catch (error) {
            console.error('Failed to fetch job applications:', error);
        } finally {
            set({ loading: false });
        }
    },
    updateApplicationStatus: async (applicationId, status) => {
        const { Authorization } = getAuthHeaders();
        set({ loading: true });
        try {
            await axios.put(
                `${WEB_URL}/api/v1/user/status`,
                { status , applicationId },
                {
                    headers: {
                        Authorization,
                    },
                }
            );
            set((state) => ({
                applications: state.applications.map((application) =>
                    application.id === applicationId ? { ...application, status } : application
                ),
            }));
        } catch (error) {
            console.error('Failed to update application status:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
