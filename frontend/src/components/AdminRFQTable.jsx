import React from "react";
import axios from "axios";

const AdminRFQsTable = ({ rfqs, fetchRFQs }) => {
  const handleApproval = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/v1/RFQS/updateStatus/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRFQs(); // Refresh RFQs
    } catch (error) {
      console.error("Error updating RFQ:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">All RFQs</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq) => (
              <tr key={rfq.id} className="border-b">
                <td className="p-2">{rfq.id}</td>
                <td className="p-2">{rfq.title}</td>
                <td className="p-2">{rfq.quantity}</td>
                <td className="p-2">{rfq.user.name}</td>
                <td className="p-2">{rfq.deadline}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleApproval(rfq.id, "approved")}
                    className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(rfq.id, "rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRFQsTable;
