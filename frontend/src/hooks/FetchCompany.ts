import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

interface Company {
  id: string;
  name: string;
  logo: string;
}

export const useFetchSingleCompany = ({ id }: { id: string }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true); 
  const token = localStorage.getItem("token")?.split(" ")[1];

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true); 

      try {
        const response = await axios.post(`${WEB_URL}/api/v1/company/find`, { id }, {
          headers: {
            Authorization: token,
          },
        });
        setCompany(response.data.company); 
      } catch (error) {
        console.error("Error fetching company:", error); 
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany(); 
    }
  }, [id, token]); 

  return { company, loading };
};
