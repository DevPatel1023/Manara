import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import AdminDashboard from "../components/AdminDashboard";
import ClientDashboard from "../components/ClientDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";

const Dashboard1 = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, redirecting...");
        navigate("/signin");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const role = response.data.user.role;
        setUserRole(role);
      } catch (error) {
        console.log("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [navigate]);

  return (
    <DashboardLayout role={userRole}>
      {userRole === "admin" ? (
        <AdminDashboard />
      ) : userRole === "employee" ? (
        <EmployeeDashboard />
      ) : (
        <ClientDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard1;
