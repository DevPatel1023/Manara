"use client"

import { useState, useEffect } from "react"
import { Filter, Eye, Check, X, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import axios from "axios"

export default function QuotationsByRFQ() {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [rfqId, setRfqId] = useState("")

  // Get RFQ ID from URL if available
  useEffect(() => {
    // This would get the RFQ ID from the URL in a real app
    // For example: const id = window.location.pathname.split('/').pop();
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("rfqId")
    if (id) {
      setRfqId(id)
    }
  }, [])

  // Fetch quotations from API
  useEffect(() => {
    const fetchClientQuotations = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:3000/api/v1/quotations/client", {
          headers: {
            Authorization: `Bearer ${token}`, // replace with actual token
          },
        });
  
        setQuotations(res.data); // or setQuotationsByRFQ(res.data), etc.
      } catch (err) {
        console.error("Error fetching client quotations:", err);
      }
    };
  
    fetchClientQuotations();
  }, []);
  

  // Update quotation status
  const updateQuotationStatus = async (quotationId, newStatus) => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await axios.patch(
        `http://localhost:3000/api/v1/quotations/status/${quotationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Update the local state with the updated quotation
      if (response.status === 200) {
        setQuotations((prevQuotations) =>
          prevQuotations.map((q) => (q._id === quotationId ? { ...q, status: newStatus } : q)),
        )
        alert(`Quotation ${newStatus} successfully`)
      }
    } catch (error) {
      console.error("Failed to update quotation status:", error)
      alert(`Failed to update status: ${error.response?.data?.msg || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // View quotation details
  const viewQuotation = (quotationId) => {
    // Navigate to quotation details page
    window.location.href = `/quotations/view/${quotationId}`
  }

  // Filter quotations
  const filteredQuotations = quotations.filter((quote) => {
    // Filter by status
    if (selectedStatus !== "all" && quote.status !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !quote.billToCompany?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quote.poNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredQuotations.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage)

  // Status colors for badges
  const statusColors = {
    accepted: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
  }

  // Count quotations by status
  const statusCounts = {
    all: quotations.length,
    pending: quotations.filter((q) => q.status === "pending").length,
    accepted: quotations.filter((q) => q.status === "accepted").length,
    rejected: quotations.filter((q) => q.status === "rejected").length,
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{rfqId ? `Quotations for RFQ: ${rfqId}` : "All Quotations"}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {rfqId ? "Review and manage quotations for this request for quote" : "View and manage all quotations"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search quotations..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Filter size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <StatusFilter
            status="all"
            label="All"
            count={statusCounts.all}
            selected={selectedStatus === "all"}
            onClick={() => setSelectedStatus("all")}
          />
          <StatusFilter
            status="pending"
            label="Pending"
            count={statusCounts.pending}
            selected={selectedStatus === "pending"}
            onClick={() => setSelectedStatus("pending")}
          />
          <StatusFilter
            status="accepted"
            label="Accepted"
            count={statusCounts.accepted}
            selected={selectedStatus === "accepted"}
            onClick={() => setSelectedStatus("accepted")}
          />
          <StatusFilter
            status="rejected"
            label="Rejected"
            count={statusCounts.rejected}
            selected={selectedStatus === "rejected"}
            onClick={() => setSelectedStatus("rejected")}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={18} />
          {error}
        </div>
      )}

      {/* Quotations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quotation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Delivery Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Loading quotations...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((quote) => (
                  <tr
                    key={quote._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.poNumber}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {quote.services?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{quote.billToCompany}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(quote.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(quote.deliveryDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${quote.total?.toFixed(2) || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[quote.status]}`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => viewQuotation(quote._id)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="View Quotation"
                        >
                          <Eye size={18} />
                        </button>

                        {quote.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateQuotationStatus(quote._id, "accepted")}
                              className="p-1 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title="Accept Quotation"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateQuotationStatus(quote._id, "rejected")}
                              className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Reject Quotation"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No quotations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredQuotations.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredQuotations.length)}</span> of{" "}
                  <span className="font-medium">{filteredQuotations.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === i + 1
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Status Filter Button
function StatusFilter({ status, label, count, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm ${
        selected
          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {label} <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
    </button>
  )
}
