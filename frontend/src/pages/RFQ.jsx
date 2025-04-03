import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import axios from "axios";
import { Plus } from "lucide-react";
import RFQsForm from "../components/RFQsForm"; // Separate form component
import ClientRFQsTable from "../components/ClientRFQTable"; // Table for client RFQs
import AdminRFQsTable from "../components/AdminRFQTable"; // Table for admin RFQs
import Button from "../components/Button";

const RFQ = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rfqs, setRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch RFQs based on role
  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        role === "admin"
          ? "http://localhost:3000/api/v1/RFQS/allRFQs"
          : "http://localhost:3000/api/v1/RFQS/myRFQs";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRFQs(response.data.rfqs);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch RFQs.");
      setLoading(false);
    }
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
                  {role === "admin" ? "All RFQs" : "Your RFQs"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {role === "admin"
                    ? "Manage all RFQs from different users"
                    : "View and manage your RFQs"}
                </p>
              </div>
              {role !== "admin" && (
                <Button
                  onClick={() => setIsOpen(true)}
                  style="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Plus size={18} className="mr-2" /> New RFQ
                </Button>
              )}
            </div>

            {isOpen && <RFQsForm setIsOpen={setIsOpen} fetchRFQs={fetchRFQs} />}
            {!isOpen && (
              <>
                {loading ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading RFQs...
                  </p>
                ) : role === "admin" ? (
                  <AdminRFQsTable rfqs={rfqs} fetchRFQs={fetchRFQs} />
                ) : (
                  <ClientRFQsTable rfqs={rfqs} fetchRFQs={fetchRFQs} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQ;
