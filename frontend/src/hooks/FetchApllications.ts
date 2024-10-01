import { WEB_URL } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token")?.split(" ")[1];
    const { id } = useParams();
    
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${WEB_URL}/api/v1/user/allapplications/${id}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                console.log(response.data.allApplications);
                if (response.data.success) {
                    setApplications(response.data.allApplications);
                } else {
                    console.error("Failed to applications:", response.data.data);
                }
            } catch (error) {
                console.error("Error fetching apllications:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchApplications();
        }
    }, [id, token]);

    return { loading, applications }; // Returns loading status and job data
};
