import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminQuotationTable = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/v1/quotations/getall", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setQuotations(res.data);
      } catch (err) {
        console.error("Error fetching quotations:", err.message);
        setError("Failed to load quotations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Quotations</h2>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading quotations...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : quotations.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">No quotations available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800 rounded-xl shadow">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {quotations.map((quote) => (
                <tr key={quote._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {quote.poNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {quote.companyName || quote.billToCompany || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(quote.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(quote.deliveryDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">
                    ₹{quote.total?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        quote.status === "accepted" || quote.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : quote.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuotationTable;