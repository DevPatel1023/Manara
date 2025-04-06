import React from "react";
import { FileText, ClipboardList } from "lucide-react";

const EmployeeRFQsTable = ({ rfqs, fetchRFQs }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">RFQ ID</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rfqs.length > 0 ? (
            rfqs.map((rfq) => (
              <tr
                key={rfq._id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 font-medium">{rfq._id}</td>
                <td className="px-4 py-2">{rfq.createdBy?.companyName || "N/A"}</td>
                <td className="px-4 py-2">{rfq.description || "No Description"}</td>
                <td className="px-4 py-2">{new Date(rfq.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-2 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      rfq.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : rfq.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rfq.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800 transition"
                    onClick={() => console.log("View RFQ", rfq._id)}
                  >
                    <ClipboardList size={16} className="mr-1" />
                    View
                  </button>
                  <button
                    className="flex items-center text-emerald-600 hover:text-emerald-800 transition"
                    onClick={() => console.log("Create Quotation", rfq._id)}
                  >
                    <FileText size={16} className="mr-1" />
                    Quote
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                No assigned RFQs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeRFQsTable;
