import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import axios from "axios";
import { Plus } from "lucide-react";
import RFQsForm from "../components/RFQsForm";
import ClientRFQsTable from "../components/ClientRFQTable";
import AdminRFQsTable from "../components/AdminRFQTable";
import EmployeeRFQsTable from "../components/EmployeeRFQsTable"; // Create if needed
import Button from "../components/Button";

const RFQ = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRFQs();
  }, [role]);

  const fetchRFQs = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(role)
      let endpoint = "";
      if (role === "admin") {
        endpoint = "http://localhost:3000/api/v1/RFQS/getAllRFQs";
      } else if (role === "client") {
        endpoint = "http://localhost:3000/api/v1/RFQS/myRfqs";
      } else if (role === "employee") {
        endpoint = "http://localhost:3000/api/v1/RFQS/assignedRfqs"; // optional
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRFQs(response.data.rfqs || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch RFQs:", error);
      setError("Failed to fetch RFQs.");
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return <p className="text-gray-600 dark:text-gray-400">Loading RFQs...</p>;
    }

    if (role === "admin") {
      return <AdminRFQsTable rfqs={rfqs} fetchRFQs={fetchRFQs} />;
    } else if (role === "client") {
      return <ClientRFQsTable rfqs={rfqs} fetchRFQs={fetchRFQs} />;
    } else if (role === "employee") {
      return <EmployeeRFQsTable rfqs={rfqs} fetchRFQs={fetchRFQs} />;
    }

    return <p className="text-red-500">Invalid role</p>;
  };

  const renderCreateButton = () => {
    if (role === "client") {
      return (
        <Button
          onClick={() => setIsOpen(true)}
          style="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center"
        >
          <Plus size={18} className="mr-2" /> New RFQ
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SideBar role={role} />
      <div className="flex-1 overflow-auto">
        <TopBar title="RFQs" />

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {role === "admin"
                    ? "All RFQs"
                    : role === "client"
                    ? "Your RFQs"
                    : "Assigned RFQs"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {role === "admin"
                    ? "Manage all RFQs from different clients"
                    : role === "client"
                    ? "View and manage your created RFQs"
                    : "Review and respond to assigned RFQs"}
                </p>
              </div>
              {renderCreateButton()}
            </div>

            {isOpen ? (
              <RFQsForm setIsOpen={setIsOpen} fetchRFQs={fetchRFQs} />
            ) : (
              renderTable()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQ;
