import { WEB_URL } from '@/Config';
import axios from 'axios';
import { create } from 'zustand';

enum Role {
  Candidate = "Candidate",
  Recruiter = "Recruiter",
}

export interface Company {
  id: string
  logo: string;
  name: string;
}

enum ApplicationStatus {
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
  jobApplication: JobApplication[];
  companyId: string;
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  requirement: string;
  isOpen: boolean;
  recruiterId: string;
  createdAt: string;
  company : Company
}

export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  createdJobs: Job[];
  jobApplication: JobApplication[];
  savedJobs: Job[];
}

interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => void;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const useProfileState = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${WEB_URL}/api/v1/user/me`, {
        headers: getAuthHeaders(),
      });
      const data = response.data.user;
      set((state) => {
        if (JSON.stringify(state.profile) !== JSON.stringify(data)) {
          return { profile: data, isLoading: false };
        }
        return { isLoading: false };
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateProfile: (data: Partial<ProfileData>) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),
}));

export default useProfileState;
