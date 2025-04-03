import React, { useEffect, useState } from "react";
import axios from "axios";

const ClientRFQsTable = () => {
  const [rfqs, setRFQs] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRFQs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/RFQS/myRfqs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRFQs(response.data);
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your RFQs</h2>
      {rfqs.length === 0 ? (
        <p>No RFQs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Deadline</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rfqs.map((rfq) => (
                <tr key={rfq._id} className="border-b">
                  <td className="p-2">{rfq.title}</td>
                  <td className="p-2">{rfq.quantity}</td>
                  <td className="p-2">{rfq.description}</td>
                  <td className="p-2">{new Date(rfq.deadline).toLocaleDateString()}</td>
                  <td className="p-2">{rfq.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientRFQsTable;
