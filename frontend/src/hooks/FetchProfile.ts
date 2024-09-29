import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

interface JobApplication {
  id: string;
  title: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  requirement: string;
  isOpen: boolean;
  recruiterId: string;
  createdAt: string; 
}

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdJobs: Job[];
  jobApplications: JobApplication[];
}

export const useProfile = () => {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("token")?.split(" ")[1];

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!token) return;

            try {
                setLoading(true);
                const response = await axios.get(`${WEB_URL}/api/v1/user/me`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setData(response.data.user);
                console.log(response.data.user.Jobs);
                
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to fetch profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    return { loading, data, error };
};
