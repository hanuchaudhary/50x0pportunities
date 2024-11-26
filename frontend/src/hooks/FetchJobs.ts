import { WEB_URL } from "@/Config";
import { getAuthHeaders } from "@/store/profileState";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const { Authorization } = getAuthHeaders()
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await axios.get(
          `${WEB_URL}/api/v1/job/bulk?filter=${filter}`,
          {
            headers: {
              Authorization
            },
          }
        );
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
