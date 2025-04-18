"use client"

import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import axios from "axios"

// Base API URL
const API_BASE_URL = "http://localhost:3000/api/v1"

// Company data that remains constant
const companyInfo = {
  companyName: "TECH ELECON PVT. LTD",
  address: "Anand Sojitra Road",
  cityState: "Vallabh Vidyanagar, Gujarat",
  postalCode: "388120",
  email: "inquiry@techelecon.com",
}

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch invoices from backend
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const endpoint = `${API_BASE_URL}/PO/all?status=approved`

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        console.log("API response:", response.data)

        const invoicesData = response.data.pos || [] // Get the POs array from response

        const mappedInvoices = invoicesData.map((po) => ({
          ...po,
          // Map client data from clientId
          client: {
            email: po.clientId?.email || "",
          },
          // Keep company info consistent
          companyName: companyInfo.companyName,
          address: companyInfo.address,
          cityState: companyInfo.cityState,
          postalCode: companyInfo.postalCode,
          email: companyInfo.email,
          // Use deliveryDate as dueDate if dueDate is not available
          dueDate: po.dueDate || po.deliveryDate,
        }))

        setInvoices(mappedInvoices)
        setError(null)
      } catch (err) {
        console.error("Error fetching invoices:", err)
        setError("Failed to load invoices. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // Open invoice modal for viewing details
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  // Close the invoice modal
  const closeModal = () => {
    setSelectedInvoice(null)
    setIsModalOpen(false)
  }

  // Utility to format currency in rupees
  const formatRupees = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`

  // Generate and download PDF invoice using jsPDF
  const downloadInvoice = (invoice) => {
    const doc = new jsPDF()
    let y = 20

    // Header Section
    doc.setFontSize(22)
    doc.text("Invoice", 105, y, { align: "center" })
    y += 10
    doc.setLineWidth(0.5)
    doc.line(20, y, 190, y)
    y += 10

    doc.setFontSize(12)
    const addText = (label, value) => {
      doc.text(`${label}: ${value}`, 20, y)
      y += 8
    }

    addText("PO Number", invoice.poNumber || invoice._id.substring(0, 8))
    addText("Company", companyInfo.companyName)
    addText("Address", companyInfo.address)
    addText("City/State", companyInfo.cityState)
    addText("Postal Code", companyInfo.postalCode)
    addText("Email", companyInfo.email)
    addText("Bill To Company", invoice.billTo?.company || "N/A")
    addText("Bill To Address", invoice.billTo?.address || "N/A")
    addText("Bill To City/State", invoice.billTo?.cityState || "N/A")
    addText("Bill To Postal Code", invoice.billTo?.postalCode || "N/A")
    addText("Bill To Email", invoice.clientId?.email || invoice.billTo?.email || "N/A")
    addText("Bill To Phone", invoice.billTo?.phone || "N/A")

    addText("Notes", invoice.notes || "")
    y += 5

    // Services Section Header
    doc.setFontSize(14)
    doc.text("Services", 20, y)
    y += 8
    doc.setFontSize(12)

    // Draw a table header for services
    doc.setFont("helvetica", "bold")
    doc.text("Service Name", 20, y)
    doc.text("Qty", 80, y)
    doc.text("Unit Price", 100, y)
    doc.text("Total", 140, y)
    doc.setFont("helvetica", "normal")
    y += 6
    doc.line(20, y, 190, y)
    y += 4

    // List each service/item
    const items = invoice.services || invoice.items || []
    if (items.length > 0) {
      items.forEach((item) => {
        doc.text(item.name || item.description || "Item", 20, y)
        doc.text(String(item.hours || item.quantity || 0), 80, y)
        doc.text(formatRupees(item.rate || item.ratePerHour || item.price || 0), 100, y)
        doc.text(
          formatRupees(item.amount || item.total || item.rate * item.hours || item.price * item.quantity || 0),
          140,
          y,
        )
        y += 8
      })
    }

    y += 5
    doc.line(20, y, 190, y)
    y += 8

    // Totals Section
    const subtotal = invoice.subtotal || invoice.totalAmount || 0
    const taxRate = invoice.taxRate || 18 // Default GST rate if not specified
    const tax = invoice.tax || (subtotal * taxRate) / 100
    const total = invoice.total || subtotal + tax

    addText("Subtotal", formatRupees(subtotal))
    addText("Tax Rate", `${taxRate}%`)
    addText("Tax", formatRupees(tax))
    addText("Total", formatRupees(total))

    // Download the file
    doc.save(`Invoice_${invoice.poNumber || invoice._id.substring(0, 8)}.pdf`)
  }

  // Admin function to update invoice status
  const updateInvoiceStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/invoice/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update the invoice in the local state
      setInvoices(invoices.map((invoice) => (invoice._id === id ? { ...invoice, status: newStatus } : invoice)))

      // If the selected invoice is the one being updated, update it too
      if (selectedInvoice && selectedInvoice._id === id) {
        setSelectedInvoice({ ...selectedInvoice, status: newStatus })
      }

      alert(`Invoice status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating invoice status:", error)
      alert("Failed to update invoice status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-5 bg-gray-800 text-white flex items-center justify-center">
        <p className="text-xl">Loading invoices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-5 bg-gray-800 text-white flex items-center justify-center">
        <div className="bg-red-600 p-4 rounded-lg">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const isAdmin = localStorage.getItem("userRole") === "admin"

  return (
    <div className="min-h-screen p-5 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-5 text-center">Invoices</h1>

      {invoices.length === 0 ? (
        <div className="bg-gray-700 p-8 rounded-lg text-center">
          <p className="text-xl">No invoices found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Invoice ID</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Created Date</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-600">
                  <td className="border px-4 py-2">{invoice.poNumber || invoice._id.substring(0, 8)}</td>
                  <td className="border px-4 py-2">{invoice.clientId?.email || invoice.billTo?.company || "N/A"}</td>
                  <td className="border px-4 py-2">
                    {new Date(invoice.createdAt || invoice.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(invoice.dueDate || invoice.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{formatRupees(invoice.totalAmount || invoice.total || 0)}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        invoice.status === "paid"
                          ? "bg-green-500"
                          : invoice.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {invoice.status || "pending"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => viewInvoice(invoice)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadInvoice(invoice)}
                      className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Invoice Details */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-5 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Invoice Details</h2>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <h3 className="font-semibold text-lg mb-2">From:</h3>
                <p>{companyInfo.companyName}</p>
                <p>{companyInfo.address}</p>
                <p>
                  {companyInfo.cityState}, {companyInfo.postalCode}
                </p>
                <p>{companyInfo.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                <p>{selectedInvoice.billTo?.company || "N/A"}</p>
                <p>{selectedInvoice.billTo?.address || "N/A"}</p>
                <p>
                  {selectedInvoice.billTo?.cityState || "N/A"}, {selectedInvoice.billTo?.postalCode || "N/A"}
                </p>
                <p>{selectedInvoice.clientId?.email || selectedInvoice.billTo?.email || "N/A"}</p>
                <p>{selectedInvoice.billTo?.phone || "N/A"}</p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <p>
                  <strong>Invoice ID:</strong> {selectedInvoice.poNumber || selectedInvoice._id.substring(0, 8)}
                </p>
                <p>
                  <strong>Status:</strong>
                  {isAdmin ? (
                    <select
                      className="ml-2 px-2 py-1 rounded text-sm border"
                      value={selectedInvoice.status || "pending"}
                      onChange={(e) => updateInvoiceStatus(selectedInvoice._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedInvoice.status === "paid"
                          ? "bg-green-500"
                          : selectedInvoice.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {selectedInvoice.status || "pending"}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {new Date(selectedInvoice.createdAt || selectedInvoice.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(selectedInvoice.dueDate || selectedInvoice.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 border-b pb-1">Items / Services</h3>
              <table className="min-w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Hours</th>
                    <th className="px-4 py-2 text-left">Unit Price</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedInvoice.items || selectedInvoice.services || []).length > 0 ? (
                    (selectedInvoice.items || selectedInvoice.services).map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{item.name || item.description || "N/A"}</td>
                        <td className="px-4 py-2">{item.hours || item.quantity || "0"}</td>
                        <td className="px-4 py-2">{formatRupees(item.rate || item.ratePerHour || item.price || 0)}</td>
                        <td className="px-4 py-2">
                          {formatRupees(
                            item.amount || item.total || item.rate * item.hours || item.price * item.quantity || 0,
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-2">
                        No items available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mb-4 border-t pt-3">
              <div className="flex justify-between">
                <div>
                  <p>
                    <strong>Payment Terms:</strong> {selectedInvoice.paymentTerms || "30 days"}
                  </p>
                  <p>
                    <strong>Notes:</strong> {selectedInvoice.notes || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>Subtotal:</strong>{" "}
                    {formatRupees(selectedInvoice.subtotal || selectedInvoice.totalAmount || 0)}
                  </p>
                  <p>
                    <strong>Tax Rate:</strong> {selectedInvoice.taxRate || 18}%
                  </p>
                  <p>
                    <strong>Tax:</strong>{" "}
                    {formatRupees(
                      selectedInvoice.tax ||
                        ((selectedInvoice.subtotal || selectedInvoice.totalAmount || 0) *
                          (selectedInvoice.taxRate || 18)) /
                          100,
                    )}
                  </p>
                  <p className="font-bold text-lg">
                    <strong>Total:</strong> {formatRupees(selectedInvoice.total || selectedInvoice.totalAmount || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => downloadInvoice(selectedInvoice)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Download PDF
              </button>
              <button onClick={closeModal} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoicesPage
