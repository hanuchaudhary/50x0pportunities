import { create } from 'zustand';
import axios from 'axios';
import { WEB_URL } from '@/Config';
import { Company } from '@/types/types';
import { getAuthHeaders } from './profileState';

interface CompaniesState {
    companies: Company[];
    fetchCompanies: () => Promise<void>;
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
    companies: [],
    fetchCompanies: async () => {
        try {
            const response = await axios.get(`${WEB_URL}/api/v1/company/bulk`, {
                headers: {
                    Authorization: getAuthHeaders().Authorization,
                }
            });
            set({ companies: response.data.companies });

        } catch (error) {
            console.error(error);
        }
    },
}));