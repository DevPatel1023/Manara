"use client"

import { useState, useEffect } from "react"
import { 
  Filter, 
  Eye, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Search,
  RefreshCw,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  Clock
} from "lucide-react"
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
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get RFQ ID from URL if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("rfqId")
    if (id) {
      setRfqId(id)
    }
  }, [])

  // Fetch quotations from API
  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/v1/quotations/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuotations(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching client quotations:", err);
      setError(err.message || "Failed to fetch quotations");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchQuotations();
  }, []);
  
  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchQuotations();
  }

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
        
        // Show toast notification instead of alert
        showToast(`Quotation ${newStatus} successfully`, "success");
      }
    } catch (error) {
      console.error("Failed to update quotation status:", error)
      showToast(`Failed to update status: ${error.response?.data?.msg || error.message}`, "error");
    } finally {
      setLoading(false)
    }
  }

  // Simple toast notification (you could replace with a proper toast library)
  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"
    } z-50 animate-fade-in-up`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // View quotation details
  const viewQuotation = (quotationId) => {
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
    accepted: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      darkBg: "dark:bg-emerald-900/30",
      darkText: "dark:text-emerald-300",
      icon: <Check size={14} className="mr-1" />
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      darkBg: "dark:bg-amber-900/30",
      darkText: "dark:text-amber-300",
      icon: <Clock size={14} className="mr-1" />
    },
    rejected: {
      bg: "bg-rose-100",
      text: "text-rose-800", 
      darkBg: "dark:bg-rose-900/30",
      darkText: "dark:text-rose-300",
      icon: <X size={14} className="mr-1" />
    }
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {rfqId ? `Quotations for RFQ #${rfqId}` : "Quotations"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and review all quotations in one place
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw 
                size={16} 
                className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Status:</span>
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "all"
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "pending"
                  ? `${statusColors.pending.bg} ${statusColors.pending.darkBg} ${statusColors.pending.text} ${statusColors.pending.darkText}`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setSelectedStatus("accepted")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "accepted"
                  ? `${statusColors.accepted.bg} ${statusColors.accepted.darkBg} ${statusColors.accepted.text} ${statusColors.accepted.darkText}`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Accepted ({statusCounts.accepted})
            </button>
            <button
              onClick={() => setSelectedStatus("rejected")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "rejected"
                  ? `${statusColors.rejected.bg} ${statusColors.rejected.darkBg} ${statusColors.rejected.text} ${statusColors.rejected.darkText}`
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies or PO numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && !isRefreshing && (
        <div className="flex justify-center items-center py-20">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-indigo-600 dark:text-indigo-400">
            <div className="animate-spin mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            Loading quotations...
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading quotations</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredQuotations.length === 0 && (
        <div className="text-center rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-14">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No quotations</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {searchQuery || selectedStatus !== "all"
              ? "No quotations match your current filters. Try adjusting your search or filter criteria."
              : "Get started by creating your first quotation."}
          </p>
          {searchQuery || selectedStatus !== "all" ? (
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("all");
                }}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Quotations table */}
      {!loading && !error && filteredQuotations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Briefcase size={14} className="mr-2" />
                      Company
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FileText size={14} className="mr-2" />
                      PO Number
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      Date
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-2" />
                      Total
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((quotation, index) => (
                  <tr 
                    key={quotation._id} 
                    className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {quotation.billToCompany ? quotation.billToCompany.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                            {quotation.billToCompany || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {quotation.billToCityState || "Location not specified"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {quotation.poNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(quotation.date)}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Due: {formatDate(quotation.deliveryDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(quotation.total)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                          Tax: {quotation.taxRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[quotation.status].bg
                      } ${statusColors[quotation.status].text} ${
                        statusColors[quotation.status].darkBg
                      } ${statusColors[quotation.status].darkText}`}>
                        {statusColors[quotation.status].icon}
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewQuotation(quotation._id)}
                          className="inline-flex items-center rounded-md bg-white dark:bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                        
                        {quotation.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateQuotationStatus(quotation._id, "accepted")}
                              className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm ring-1 ring-inset ring-emerald-200 dark:ring-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                            >
                              <Check size={16} className="mr-1" />
                              Accept
                            </button>
                            <button
                              onClick={() => updateQuotationStatus(quotation._id, "rejected")}
                              className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300 shadow-sm ring-1 ring-inset ring-rose-200 dark:ring-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                            >
                              <X size={16} className="mr-1" />
                              Reject
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredQuotations.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredQuotations.length}</span> quotations
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      currentPage === 1
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      currentPage === totalPages
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}