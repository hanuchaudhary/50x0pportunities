import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  logo: string;
}

interface Job {
  id: string;
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  requirement: string;
  isOpen: boolean;
  createdAt: Date;
}

interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
    company: Company;
  };
}

export const useSingleJob = ({ id }: { id: string }) => {
  const [jobData, setJobData] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token")?.split(" ")[1];

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get<JobResponse>(`${WEB_URL}/api/v1/job/${id}`, {
          headers: {
            Authorization: token, 
          },
        });
        
        if (response.data.success) {
          setJobData(response.data); 
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

  return { loading, jobData }; // Returns loading status and job data
};
