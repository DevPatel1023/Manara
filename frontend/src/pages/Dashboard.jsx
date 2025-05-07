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

        // force redirect to fresh dashboard
        window.location.replace(`/dashboard/${role}`);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };

    fetchUserRole();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-medium">Redirecting to your dashboard...</p>
    </div>
  );
};

export default RoleRedirectDashboard;
