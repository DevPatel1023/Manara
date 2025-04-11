"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

// Dummy Data (matches your provided sample)
const dummyApprovedPOs = [
  {
    _id: "67f755b77b1fea37efdf8f9a",
    companyName: "TECH ELECON PVT. LTD",
    address: "Anand Sojitra Road",
    cityState: "Vallabh Vidyanagar, Gujarat",
    postalCode: "388120",
    email: "inquiry@techelecon.com",
    poNumber: "4568",
    date: "2025-04-10T00:00:00.000Z",
    deliveryDate: "2025-04-17T00:00:00.000Z",
    billToCompany: "SilliconQuip",
    billToAddress: "Ahmedabad",
    billToCityState: "Gujrat",
    billToPostalCode: "12556",
    billToEmail: "SilliconQuip@gmail.com",
    billToPhone: "8656861234",
    services: [
      {
        _id: "67f755b77b1fea37efdf8f9b",
        name: "sillicon quantum chip",
        quantity: 700,
        unitPrice: 100,
        total: 70000,
      },
    ],
    taxRate: 15,
    subtotal: 70000,
    tax: 10500,
    total: 80500,
    paymentTerms: "30% Advance, 70% on Completion",
    notes: "Order soon",
    rfqId: "67f62c6442e87e9655664183",
    supplierId: "67d80f4c489e3c4f72807caa",
    status: "approved",
  },
  // You can add more dummy objects here if needed.
];

const InvoicesPage = () => {
  const [approvedPOs] = useState(dummyApprovedPOs);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open invoice modal for viewing details
  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Close the invoice modal
  const closeModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  // Utility to format currency in rupees
  const formatRupees = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

  // Generate and download PDF invoice using jsPDF
  const downloadInvoice = (invoice) => {
    const doc = new jsPDF();
    let y = 20;

    // Header Section
    doc.setFontSize(22);
    doc.text("Invoice", 105, y, { align: "center" });
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    const addText = (label, value) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 8;
    };

    addText("PO Number", invoice.poNumber);
    addText("Company", invoice.companyName);
    addText("Address", invoice.address);
    addText("City/State", invoice.cityState);
    addText("Postal Code", invoice.postalCode);
    addText("Email", invoice.email);
    addText("Bill To Company", invoice.billToCompany);
    addText("Bill To Address", invoice.billToAddress);
    addText("Bill To City/State", invoice.billToCityState);
    addText("Bill To Postal Code", invoice.billToPostalCode);
    addText("Bill To Email", invoice.billToEmail);
    addText("Bill To Phone", invoice.billToPhone);
    addText("Date", new Date(invoice.date).toLocaleDateString());
    addText("Delivery Date", new Date(invoice.deliveryDate).toLocaleDateString());
    addText("Payment Terms", invoice.paymentTerms);
    addText("Notes", invoice.notes);
    y += 5;
    
    // Services Section Header
    doc.setFontSize(14);
    doc.text("Services", 20, y);
    y += 8;
    doc.setFontSize(12);
    
    // Draw a table header for services
    doc.setFont("helvetica", "bold");
    doc.text("Service Name", 20, y);
    doc.text("Qty", 80, y);
    doc.text("Unit Price", 100, y);
    doc.text("Total", 140, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.line(20, y, 190, y);
    y += 4;
    
    // List each service
    if (invoice.services && invoice.services.length > 0) {
      invoice.services.forEach((service) => {
        doc.text(service.name, 20, y);
        doc.text(String(service.quantity), 80, y);
        doc.text(formatRupees(service.unitPrice), 100, y);
        doc.text(formatRupees(service.total), 140, y);
        y += 8;
      });
    }
    
    y += 5;
    doc.line(20, y, 190, y);
    y += 8;
    
    // Totals Section
    addText("Subtotal", formatRupees(invoice.subtotal));
    addText("Tax Rate", `${invoice.taxRate}%`);
    addText("Tax", formatRupees(invoice.tax));
    addText("Total", formatRupees(invoice.total));

    // Download the file
    doc.save(`Invoice_${invoice.poNumber}.pdf`);
  };

  return (
    <div className="min-h-screen p-5 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-5 text-center">Invoices</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">PO Number</th>
              <th className="px-4 py-2 text-left">Company Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Delivery Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedPOs.map((invoice) => (
              <tr key={invoice._id} className="hover:bg-gray-600">
                <td className="border px-4 py-2">{invoice.poNumber || "N/A"}</td>
                <td className="border px-4 py-2">
                  {invoice.companyName || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(invoice.deliveryDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {formatRupees(invoice.total) || "N/A"}
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

      {/* Modal for Viewing Invoice Details */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-5 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Invoice Details
            </h2>
            <div className="mb-4">
              <p>
                <strong>PO Number:</strong>{" "}
                {selectedInvoice.poNumber || "N/A"}
              </p>
              <p>
                <strong>Company Name:</strong>{" "}
                {selectedInvoice.companyName || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedInvoice.address || "N/A"}
              </p>
              <p>
                <strong>City/State:</strong>{" "}
                {selectedInvoice.cityState || "N/A"}
              </p>
              <p>
                <strong>Postal Code:</strong>{" "}
                {selectedInvoice.postalCode || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedInvoice.email || "N/A"}
              </p>
              <p>
                <strong>Bill To Company:</strong>{" "}
                {selectedInvoice.billToCompany || "N/A"}
              </p>
              <p>
                <strong>Bill To Address:</strong>{" "}
                {selectedInvoice.billToAddress || "N/A"}
              </p>
              <p>
                <strong>Bill To City/State:</strong>{" "}
                {selectedInvoice.billToCityState || "N/A"}
              </p>
              <p>
                <strong>Bill To Postal Code:</strong>{" "}
                {selectedInvoice.billToPostalCode || "N/A"}
              </p>
              <p>
                <strong>Bill To Email:</strong>{" "}
                {selectedInvoice.billToEmail || "N/A"}
              </p>
              <p>
                <strong>Bill To Phone:</strong>{" "}
                {selectedInvoice.billToPhone || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedInvoice.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Delivery Date:</strong>{" "}
                {new Date(selectedInvoice.deliveryDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment Terms:</strong>{" "}
                {selectedInvoice.paymentTerms || "N/A"}
              </p>
              <p>
                <strong>Notes:</strong>{" "}
                {selectedInvoice.notes || "N/A"}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 border-b pb-1">
                Services
              </h3>
              <table className="min-w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Service Name</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Unit Price</th>
                    <th className="px-4 py-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.services &&
                  selectedInvoice.services.length > 0 ? (
                    selectedInvoice.services.map((service, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">
                          {service.name || "N/A"}
                        </td>
                        <td className="px-4 py-2">
                          {service.quantity || "0"}
                        </td>
                        <td className="px-4 py-2">
                          {formatRupees(service.unitPrice)}
                        </td>
                        <td className="px-4 py-2">
                          {formatRupees(service.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-2">
                        No services available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mb-4 border-t pt-3">
              <p>
                <strong>Subtotal:</strong>{" "}
                {formatRupees(selectedInvoice.subtotal) || "N/A"}
              </p>
              <p>
                <strong>Tax Rate:</strong>{" "}
                {selectedInvoice.taxRate || "N/A"}%
              </p>
              <p>
                <strong>Tax:</strong>{" "}
                {formatRupees(selectedInvoice.tax) || "N/A"}
              </p>
              <p>
                <strong>Total:</strong>{" "}
                {formatRupees(selectedInvoice.total) || "N/A"}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
