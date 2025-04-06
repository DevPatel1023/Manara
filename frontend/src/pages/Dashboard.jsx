import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoleRedirectDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = response.data.user.role;
        navigate(`/dashboard/${role}`);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        navigate("/signin");
      }
    };

    fetchUserRole();
  }, [navigate]);

  return null; // You can show a spinner here if you want
};

export default RoleRedirectDashboard;
