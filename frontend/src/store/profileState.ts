import { WEB_URL } from '@/Config';
import { User } from '@/types/types';
import axios from 'axios';
import { create } from 'zustand';


interface ProfileState {
  profile: User
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const useProfileStore = create<ProfileState>((set) => ({
  profile: {} as User,
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

  updateProfile: (data: Partial<ProfileState>) =>
    set((state) => ({
      profile: state.profile && { ...state.profile, ...data },
    })),
}));

export default useProfileStore;
