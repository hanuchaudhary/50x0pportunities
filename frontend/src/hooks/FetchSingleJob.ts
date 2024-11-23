import { WEB_URL } from "@/Config";
import { getAuthHeaders, Job } from "@/store/profileState";
import axios from "axios";
import { useEffect, useState } from "react";

export const useSingleJob = ({ id }: { id: string }) => {
  const [jobData, setJobData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token")?.split(" ")[1];
  const { Authorization } = getAuthHeaders()
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${WEB_URL}/api/v1/job/${id}`, {
          headers: {
            Authorization
          },
        });

        if (response.data.success) {
          setJobData(response.data.job);
        } else {
          console.error("Failed to fetch job:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching the job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSingleJob();
    }
  }, [id, token]);

  return { loading, jobData };
};
