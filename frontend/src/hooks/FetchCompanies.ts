import { WEB_URL } from "@/Config";
import { getAuthHeaders } from "@/store/profileState";
import axios from "axios";
import { useEffect, useState } from "react";

interface companiesTypes {
    id: string
    name: string
    logo: string

}

export const useFetchCompanies = () => {
    const [companies, setCompanies] = useState<companiesTypes[]>([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token")?.split(" ")[1];
    const {Authorization} = getAuthHeaders();
    useEffect(() => {


        try {
            setLoading(true)
            const fetch = async () => {
                const response = await axios.get(`${WEB_URL}/api/v1/company/bulk`, {
                    headers: {
                        Authorization
                    }
                });
                setCompanies(response.data.companies)
            }
            fetch();
            setLoading(false);
        } catch (error) {
            setLoading(true);
            console.log(error);
        }
    }, [token])
    return { companies, loading }
} 