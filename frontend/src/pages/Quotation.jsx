"use client"

import { useState, useEffect } from "react"
import { Eye, Check, X } from "lucide-react"
import axios from "axios"

export default function QuotationsByRFQ() {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedQuotation, setSelectedQuotation] = useState(null)

  // Fetch quotations from API
  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/v1/quotations/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Fetched quotations:", res.data)
      setQuotations(res.data)
      setError("")
    } catch (err) {
      console.error("Error fetching client quotations:", err)
      setError("Failed to load quotations. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchQuotations()
  }, [])

  // Update quotation status and close modal
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

      if (response.status === 200) {
        setQuotations((prevQuotations) =>
          prevQuotations.map((q) => (q._id === quotationId ? { ...q, status: newStatus } : q))
        )
        closeDetail() // Close the modal after successful update
      }
    } catch (error) {
      console.error("Failed to update quotation status:", error)
      setError(`Failed to update status: ${error.response?.data?.msg || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }) || "₹0"
  }

  const handleViewQuotation = (quotation) => {
    console.log("Selected quotation:", quotation)
    setSelectedQuotation(quotation)
  }

  const closeDetail = () => {
    setSelectedQuotation(null)
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Your Quotations</h2>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-10">Loading quotations...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : quotations.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-10">No quotations available.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">PO Number</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Company</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Total</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {quotations.map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{quote.poNumber || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{quote.billToCompany || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(quote.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatDate(quote.deliveryDate)}</td>
                  <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">{formatCurrency(quote.total)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
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
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleViewQuotation(quote)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-md transition duration-150 hover:shadow-md"
                    >
                      <Eye size={16} className="inline mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="dark:bg-gray-800 dark:text-white bg-white text-black rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-xl font-semibold">Quotation Details</h3>
                <button 
                  onClick={closeDetail}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="dark:bg-gray-700 bg-white p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium text-gray-500">ID:</span> {selectedQuotation._id}</p>
                    <p><span className="font-medium text-gray-500">PO Number:</span> {selectedQuotation.poNumber || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">Date:</span> {formatDate(selectedQuotation.date)}</p>
                    <p><span className="font-medium text-gray-500">Delivery Date:</span> {formatDate(selectedQuotation.deliveryDate)}</p>
                    <p><span className="font-medium text-gray-500">Status:</span> 
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          selectedQuotation.status === "accepted" || selectedQuotation.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedQuotation.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedQuotation.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Client Information</h4>
                  <div className="space-y-3">
                    <p><span className="font-medium text-gray-500">Company:</span> {selectedQuotation.billToCompany || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">Address:</span> {selectedQuotation.billToAddress || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">City/State:</span> {selectedQuotation.billToCityState || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">Postal Code:</span> {selectedQuotation.billToPostalCode || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">Email:</span> {selectedQuotation.billToEmail || "N/A"}</p>
                    <p><span className="font-medium text-gray-500">Phone:</span> {selectedQuotation.billToPhone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Services section */}
              {selectedQuotation.services && selectedQuotation.services.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-4">Services</h4>
                  <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-600 dark:bg-gray-900 text-black">
                      <thead>
                        <tr className="dark:bg-gray-800">
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        {selectedQuotation.services.map((service, index) => (
                          <tr key={index} className="dark:bg-gray-700 bg-white text-black transition-colors">
                            <td className="px-6 py-4 text-sm font-medium dark:text-white">{service.name || "N/A"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{service.quantity || 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(service.unitPrice)}</td>
                            <td className="px-6 py-4 text-sm font-medium dark:text-white">{formatCurrency(service.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary section */}
              <div className="mt-6 flex justify-end">
                <div className="w-72 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-400">Subtotal:</span>
                    <span className="text-sm font-medium dark:text-white">{formatCurrency(selectedQuotation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-gray-400">Tax ({selectedQuotation.taxRate || 0}%):</span>
                    <span className="text-sm font-medium dark:text-white">{formatCurrency(selectedQuotation.tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-3">
                    <span className="text-base font-medium dark:text-white">Total:</span>
                    <span className="text-base font-bold text-green-400">{formatCurrency(selectedQuotation.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                {selectedQuotation.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateQuotationStatus(selectedQuotation._id, "accepted")}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-150 shadow-md flex items-center"
                      disabled={loading}
                    >
                      <Check size={16} className="mr-2" /> Accept
                    </button>
                    <button
                      onClick={() => updateQuotationStatus(selectedQuotation._id, "rejected")}
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-150 shadow-md flex items-center"
                      disabled={loading}
                    >
                      <X size={16} className="mr-2" /> Reject
                    </button>
                  </>
                )}
                <button 
                  onClick={closeDetail}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150 shadow-md"
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}