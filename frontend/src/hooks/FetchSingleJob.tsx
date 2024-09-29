import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

interface jobTypes {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  requirement: string;
  isOpen: string;
  createAt: string;
}

export const useSingleJob = ({ id }: { id: string }) => {
  const [data, setData] = useState<jobTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token")?.split(" ")[1];

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${WEB_URL}/api/v1/job/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setData(response.data.job);
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

  return { loading, data };
};
