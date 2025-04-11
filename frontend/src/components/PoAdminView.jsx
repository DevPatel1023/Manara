"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Eye } from "lucide-react";

const POAdminView = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in to view POs");

        const response = await axios.get("http://localhost:3000/api/v1/PO/all", {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });

        console.log("API Response:", response.data);

        const poList = response.data?.pos || [];
        if (!Array.isArray(poList))
          throw new Error("No POs found or invalid response format");

        setPos(poList);
      } catch (err) {
        console.error("Error fetching POs:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, []);

  const viewPO = (po) => {
    console.log("Selected PO:", po);
    setSelectedPO(po);
    setIsModalOpen(true);
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to update status");

      await axios.put(
        `http://localhost:3000/api/v1/PO/status/${selectedPO._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the specific PO in local state
      setPos(pos.map((po) => (po._id === selectedPO._id ? { ...po, status } : po)));
      setSelectedPO({ ...selectedPO, status });
      alert(`PO status updated to ${status}`);
    } catch (err) {
      console.error("Error updating PO status:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPO(null);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })
      : "N/A";
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-400 text-center">{error}</div>;
  if (pos.length === 0)
    return <div className="text-white text-center">No Purchase Orders found.</div>;

  return (
    <div className="w-full min-h-screen p-5 bg-[#1b263b] text-white">
      <h1 className="text-4xl font-bold text-center mb-5">Admin PO Dashboard</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[#2e3951] rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                PO Number
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Client
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Date
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Delivery Date
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Total
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Status
              </th>
              <th className="border border-gray-600 p-2.5 text-left text-sm font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po) => (
              <tr key={po._id} className="hover:bg-[#3a4560]">
                <td className="border border-gray-600 p-2.5">{po.poNumber || "N/A"}</td>
                <td className="border border-gray-600 p-2.5">
                  {typeof po.clientId === "object"
                    ? po.clientId.name || po.clientId.email || "Unknown"
                    : po.clientId || "Unknown"}
                </td>
                <td className="border border-gray-600 p-2.5">{formatDate(po.date)}</td>
                <td className="border border-gray-600 p-2.5">
                  {formatDate(po.deliveryDate)}
                </td>
                <td className="border border-gray-600 p-2.5">
                  ${po.total !== undefined ? po.total.toFixed(2) : "N/A"}
                </td>
                <td className="border border-gray-600 p-2.5">
                  <span
                    className={`px-2 py-1 rounded ${
                      po.status === "approved"
                        ? "bg-green-600"
                        : po.status === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {po.status || "N/A"}
                  </span>
                </td>
                <td className="border border-gray-600 p-2.5">
                  <button
                    onClick={() => viewPO(po)}
                    className="text-blue-400 hover:text-blue-600"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2e3951] p-5 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Purchase Order Details</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p>
                  <strong>PO Number:</strong> {selectedPO.poNumber || "N/A"}
                </p>
                <p>
                  <strong>Client:</strong>{" "}
                  {typeof selectedPO.clientId === "object"
                    ? selectedPO.clientId.name ||
                      selectedPO.clientId.email ||
                      "Unknown"
                    : selectedPO.clientId || "Unknown"}
                </p>
                <p>
                  <strong>Quotation:</strong>{" "}
                  {selectedPO.quotationId?.quotationNumber || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedPO.date)}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {formatDate(selectedPO.deliveryDate)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Bill To:</strong>
                </p>
                <p>{selectedPO.billTo?.company || "N/A"}</p>
                <p>{selectedPO.billTo?.address || "N/A"}</p>
                <p>
                  {selectedPO.billTo?.cityState || "N/A"},{" "}
                  {selectedPO.billTo?.postalCode || "N/A"}
                </p>
                <p>{selectedPO.billTo?.phone || "N/A"}</p>
                <p>{selectedPO.billTo?.email || "N/A"}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-600 p-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-600 p-2 text-left">Hours</th>
                    <th className="border border-gray-600 p-2 text-left">
                      Rate/Hour
                    </th>
                    <th className="border border-gray-600 p-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedPO.services || []).length > 0 ? (
                    selectedPO.services.map((service, index) => (
                      <tr key={index}>
                        <td className="border border-gray-600 p-2">
                          {service.description || "N/A"}
                        </td>
                        <td className="border border-gray-600 p-2">
                          {service.hours || "0"}
                        </td>
                        <td className="border border-gray-600 p-2">
                          ${service.ratePerHour?.toFixed(2) || "N/A"}
                        </td>
                        <td className="border border-gray-600 p-2">
                          ${service.amount?.toFixed(2) || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border border-gray-600 p-2 text-center"
                      >
                        No services available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <p>
                <strong>Subtotal:</strong>{" "}
                ${selectedPO.subtotal?.toFixed(2) || "N/A"}
              </p>
              <p>
                <strong>Tax Rate:</strong>{" "}
                {selectedPO.taxRate !== undefined
                  ? `${selectedPO.taxRate}%`
                  : "N/A"}
              </p>
              <p>
                <strong>Tax:</strong>{" "}
                ${selectedPO.tax?.toFixed(2) || "N/A"}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                ${selectedPO.total?.toFixed(2) || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong> {selectedPO.notes || "None"}
              </p>
              <p>
                <strong>Status:</strong> {selectedPO.status || "N/A"}
              </p>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => updateStatus("approved")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-600"
                disabled={selectedPO.status === "approved"}
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-600"
                disabled={selectedPO.status === "rejected"}
              >
                Reject
              </button>
            </div>

            <button
              onClick={closeModal}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POAdminView;
