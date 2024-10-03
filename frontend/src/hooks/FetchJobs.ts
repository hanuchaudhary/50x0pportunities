import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const token = localStorage.getItem("token")?.split(" ")[1];
        const response = await axios.get(
          `${WEB_URL}/api/v1/job/bulk?filter=${filter}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setData(response.data.jobs); 
      } catch (error) {
        console.log(error); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return { data, loading, setFilter };
};
