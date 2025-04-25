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

    // Set document properties
    doc.setProperties({
      title: `Invoice_${invoice.poNumber || invoice._id.substring(0, 8)}`,
      subject: "Invoice",
      author: companyInfo.companyName,
      keywords: "invoice, billing",
      creator: "Tech Elecon Invoice System",
    })

    // Colors
    const primaryColor = [41, 128, 185] // Blue
    const secondaryColor = [44, 62, 80] // Dark blue/gray
    const lightGray = [189, 195, 199] // Light gray for borders

    // Margins
    const margin = 20
    let y = margin

    // Header with logo and title
    doc.setFontSize(24)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFont("helvetica", "bold")
    doc.text("INVOICE", 105, y, { align: "center" })
    y += 10

    // Invoice number and date section
    doc.setFontSize(10)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFont("helvetica", "bold")

    // Add invoice details in a box
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(105, y, 85, 25, 2, 2, "FD")

    doc.text("INVOICE NUMBER:", 110, y + 6)
    doc.setFont("helvetica", "normal")
    doc.text(invoice.poNumber || invoice._id.substring(0, 8), 160, y + 6)

    doc.setFont("helvetica", "bold")
    doc.text("DATE ISSUED:", 110, y + 12)
    doc.setFont("helvetica", "normal")
    doc.text(new Date(invoice.createdAt || invoice.date).toLocaleDateString(), 160, y + 12)

    doc.setFont("helvetica", "bold")
    doc.text("DUE DATE:", 110, y + 18)
    doc.setFont("helvetica", "normal")
    doc.text(new Date(invoice.dueDate || invoice.deliveryDate).toLocaleDateString(), 160, y + 18)

    y += 35

    // Company and client information in two columns
    // Company info (From)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text("FROM:", margin, y)
    y += 6

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text(companyInfo.companyName, margin, y)
    y += 5

    doc.setFont("helvetica", "normal")
    doc.text(companyInfo.address, margin, y)
    y += 5
    doc.text(`${companyInfo.cityState}, ${companyInfo.postalCode}`, margin, y)
    y += 5
    doc.text(`Email: ${companyInfo.email}`, margin, y)

    // Reset y position for client info
    y -= 21

    // Client info (Bill To)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text("BILL TO:", 105, y)
    y += 6

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "bold")
    doc.text(invoice.billTo?.company || "Client", 105, y)
    y += 5

    doc.setFont("helvetica", "normal")
    doc.text(invoice.billTo?.address || "N/A", 105, y)
    y += 5
    doc.text(`${invoice.billTo?.cityState || "N/A"}, ${invoice.billTo?.postalCode || "N/A"}`, 105, y)
    y += 5
    doc.text(`Email: ${invoice.clientId?.email || invoice.billTo?.email || "N/A"}`, 105, y)
    if (invoice.billTo?.phone) {
      y += 5
      doc.text(`Phone: ${invoice.billTo.phone}`, 105, y)
    }

    // Move down to start the items table
    y += 15

    // Add a divider
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setLineWidth(0.5)
    doc.line(margin, y, 190, y)
    y += 10

    // Services/Items Table
    // Table header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(margin, y, 170, 8, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("DESCRIPTION", margin + 5, y + 5.5)
    doc.text("QTY", margin + 90, y + 5.5)
    doc.text("UNIT PRICE", margin + 110, y + 5.5)
    doc.text("AMOUNT", margin + 145, y + 5.5)
    y += 8

    // Table rows
    doc.setTextColor(0, 0, 0)
    doc.setFont("helvetica", "normal")

    const items = invoice.services || invoice.items || []
    let isAlternate = false

    if (items.length > 0) {
      items.forEach((item) => {
        // Alternate row background for better readability
        if (isAlternate) {
          doc.setFillColor(240, 240, 240)
          doc.rect(margin, y, 170, 8, "F")
        }
        isAlternate = !isAlternate

        const description = item.name || item.description || "Item"
        const quantity = String(item.hours || item.quantity || 0)
        const unitPrice = formatRupees(item.rate || item.ratePerHour || item.price || 0)
        const amount = formatRupees(
          item.amount || item.total || item.rate * item.hours || item.price * item.quantity || 0,
        )

        doc.text(description, margin + 5, y + 5.5)
        doc.text(quantity, margin + 90, y + 5.5)
        doc.text(unitPrice, margin + 110, y + 5.5)
        doc.text(amount, margin + 145, y + 5.5)

        y += 8
      })
    } else {
      doc.text("No items", margin + 5, y + 5.5)
      y += 8
    }

    // Add a divider
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2])
    doc.setLineWidth(0.5)
    doc.line(margin, y, 190, y)
    y += 10

    // Totals section
    const subtotal = invoice.subtotal || invoice.totalAmount || 0
    const taxRate = invoice.taxRate || 18 // Default GST rate if not specified
    const tax = invoice.tax || (subtotal * taxRate) / 100
    const total = invoice.total || subtotal + tax

    // Right-align the totals
    doc.setFont("helvetica", "normal")
    doc.text("Subtotal:", 130, y)
    doc.text(formatRupees(subtotal), 170, y, { align: "right" })
    y += 6

    doc.text(`Tax (${taxRate}%):`, 130, y)
    doc.text(formatRupees(tax), 170, y, { align: "right" })
    y += 6

    // Total with background highlight
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(120, y - 4, 70, 10, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("TOTAL:", 130, y + 2)
    doc.text(formatRupees(total), 170, y + 2, { align: "right" })

    y += 15

    // Notes section
    if (invoice.notes) {
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "bold")
      doc.text("Notes:", margin, y)
      y += 6
      doc.setFont("helvetica", "normal")

      // Handle multi-line notes
      const splitNotes = doc.splitTextToSize(invoice.notes, 150)
      doc.text(splitNotes, margin, y)
      y += splitNotes.length * 6
    }

    // Payment terms and thank you message
    y += 10
    doc.setFont("helvetica", "bold")
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text("Payment Terms:", margin, y)
    y += 6
    doc.setFont("helvetica", "normal")
    doc.text(invoice.paymentTerms || "Payment due within 30 days", margin, y)

    y += 15
    doc.setFont("helvetica", "italic")
    doc.text("Thank you for your business!", 105, y, { align: "center" })

    // Footer with page number
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" },
      )
    }

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
      <div className="min-h-screen p-5 dark:bg-gray-800 dark:text-white flex items-center justify-center">
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
    <div className="min-h-screen p-5 dark:bg-gray-800 border-gray-600 dark:text-white text-black">
      <h1 className="text-3xl font-bold mb-5 text-center">Invoices</h1>

      {invoices.length === 0 ? (
        <div className="dark:bg-gray-700 p-8 rounded-lg text-center">
          <p className="text-xl">No invoices found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border-gray-700">
          <table className="min-w-full  dark:bg-gray-700 rounded-lg shadow-md">
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
                <tr key={invoice._id} className="dark:hover:bg-gray-600 hover:bg-gray-200">
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
          <div className="bg-white text-black border-gray-800 p-5 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
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
