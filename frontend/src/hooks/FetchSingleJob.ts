import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";


interface Applicant {
  fullName: string;
  email: string;
  id: string;
}

interface JobApplication {
  id: string;
  applicantId: string;
  jobId: string;
  status: string;
  isApplied: boolean;
  resume: string;
  skills: string;
  experience: string;
  education: string;
  createdAt: Date;
  applicant: Applicant; 
}

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
  company: Company;
  jobApplication: JobApplication[]; 
}




export const useSingleJob = ({ id }: { id: string }) => {
  const [jobData, setJobData] = useState<Job | null>(null);
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
