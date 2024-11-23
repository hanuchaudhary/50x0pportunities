import { WEB_URL } from "@/Config";
import { useJobsStore } from "@/store/jobsState";
import { getAuthHeaders } from "@/store/profileState";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = () => {
  const {setJobs} = useJobsStore()
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const { Authorization } = getAuthHeaders()
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${WEB_URL}/api/v1/job/bulk?filter=${filter}`,
          {
            headers: {
              Authorization
            },
          }
        );
        setJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return { loading, setFilter };
};
