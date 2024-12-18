import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutUser() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/signin", { replace: true });
    }, [navigate]);
    return null;
}
