import React, { useEffect, useState } from "react";
import axios from "axios";
import { Check, X, Eye } from "lucide-react";

const AdminRFQsTable = () => {
  const [rfqs, setRFQs] = useState([]);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchRFQs = async () => {
    console.log("fetchRFQs function is running!");  // ✅ Debugging Step 1

    try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);  // ✅ Debugging Step 2

        const response = await axios.get("http://localhost:3000/api/v1/RFQS/getAllRFQS", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response Data:", response.data);  // ✅ Debugging Step 3
        setRFQs(response.data.rfqs);
    } catch (error) {
        console.error("Error fetching RFQs:", error);  // ✅ Debugging Step 4
    }
};



  useEffect(() => {
    console.log("useEffect is running!");
    fetchRFQs();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.patch(
        "http://localhost:3000/api/v1/RFQS/updateRFQStatus",
        { id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRFQs();
    } catch (error) {
      console.error("Error updating RFQ:", error);
      setError("Failed to update RFQ status. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Client-Generated RFQs</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : rfqs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No RFQs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq) => (
                <tr key={rfq._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{rfq.title}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{rfq.quantity}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{new Date(rfq.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rfq.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : rfq.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rfq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRFQ(rfq)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {rfq.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproval(rfq._id, "accepted")}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleApproval(rfq._id, "rejected")}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User & RFQ Detail Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedRFQ.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{selectedRFQ.description}</p>
            <hr className="my-3" />
            <h4 className="font-semibold text-gray-800 dark:text-white">Client Details:</h4>
            <p className="text-gray-700 dark:text-gray-400">Name: {selectedRFQ.clientId?.name}</p>
            <p className="text-gray-700 dark:text-gray-400">Email: {selectedRFQ.clientId?.email}</p>
            <button
              onClick={() => setSelectedRFQ(null)}
              className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRFQsTable;
