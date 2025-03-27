"use client"

import { useState } from "react";
import { Menu, X, Home, Users, ClipboardList, FileText, Bell, Settings, Search, Filter, Plus, MoreHorizontal, Download, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CreditCard, CheckCircle, AlertCircle, Clock, ArrowUpRight, Calendar, DollarSign, ArrowDownRight, Printer, Send, FileCheck, Ban, ChevronDown, ArrowRight, Wallet, BarChart3 } from 'lucide-react';
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Topbar from "../components/TopBar";

export default function Invoices() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");

  const invoices = [
    { 
      id: "INV-2023-06-001", 
      client: "Acme Inc.", 
      clientId: "C-001",
      amount: "$2,450.00", 
      status: "Paid", 
      date: "Jun 15, 2023",
      dueDate: "Jun 30, 2023",
      paymentMethod: "Credit Card",
      paymentDate: "Jun 20, 2023",
      items: [
        { name: "Website Design", quantity: 1, price: "$1,800.00" },
        { name: "Logo Design", quantity: 1, price: "$650.00" }
      ],
      notes: "Thank you for your business!",
      subtotal: "$2,450.00",
      tax: "$0.00",
      total: "$2,450.00"
    },
    { 
      id: "INV-2023-06-002", 
      client: "Globex Corp.", 
      clientId: "C-002",
      amount: "$1,850.00", 
      status: "Pending", 
      date: "Jun 12, 2023",
      dueDate: "Jun 27, 2023",
      paymentMethod: "Bank Transfer",
      items: [
        { name: "Monthly Maintenance", quantity: 1, price: "$950.00" },
        { name: "SEO Services", quantity: 1, price: "$900.00" }
      ],
      notes: "Net 15 payment terms",
      subtotal: "$1,850.00",
      tax: "$0.00",
      total: "$1,850.00"
    },
    { 
      id: "INV-2023-06-003", 
      client: "Stark Industries", 
      clientId: "C-003",
      amount: "$3,200.00", 
      status: "Overdue", 
      date: "Jun 10, 2023",
      dueDate: "Jun 25, 2023",
      paymentMethod: "PayPal",
      items: [
        { name: "Custom Software Development", quantity: 20, price: "$150.00/hr" },
        { name: "Server Setup", quantity: 1, price: "$200.00" }
      ],
      notes: "Please pay within 15 days",
      subtotal: "$3,200.00",
      tax: "$0.00",
      total: "$3,200.00"
    },
    { 
      id: "INV-2023-05-012", 
      client: "Wayne Enterprises", 
      clientId: "C-004",
      amount: "$4,500.00", 
      status: "Paid", 
      date: "May 28, 2023",
      dueDate: "Jun 12, 2023",
      paymentDate: "Jun 05, 2023",
      paymentMethod: "Credit Card",
      items: [
        { name: "Security Audit", quantity: 1, price: "$3,500.00" },
        { name: "Penetration Testing", quantity: 1, price: "$1,000.00" }
      ],
      notes: "Thank you for your business!",
      subtotal: "$4,500.00",
      tax: "$0.00",
      total: "$4,500.00"
    },
    { 
      id: "INV-2023-05-011", 
      client: "Oscorp Industries", 
      clientId: "C-005",
      amount: "$1,200.00", 
      status: "Cancelled", 
      date: "May 25, 2023",
      dueDate: "Jun 09, 2023",
      paymentMethod: "Bank Transfer",
      items: [
        { name: "Research Consultation", quantity: 8, price: "$150.00/hr" }
      ],
      notes: "Project cancelled by client",
      subtotal: "$1,200.00",
      tax: "$0.00",
      total: "$1,200.00"
    },
    { 
      id: "INV-2023-05-010", 
      client: "Umbrella Corporation", 
      clientId: "C-006",
      amount: "$3,750.00", 
      status: "Paid", 
      date: "May 22, 2023",
      dueDate: "Jun 06, 2023",
      paymentDate: "May 30, 2023",
      paymentMethod: "Credit Card",
      items: [
        { name: "Laboratory Equipment", quantity: 1, price: "$2,500.00" },
        { name: "Research Materials", quantity: 5, price: "$250.00" }
      ],
      notes: "Thank you for your business!",
      subtotal: "$3,750.00",
      tax: "$0.00",
      total: "$3,750.00"
    },
    { 
      id: "INV-2023-05-009", 
      client: "LexCorp", 
      clientId: "C-007",
      amount: "$2,800.00", 
      status: "Pending", 
      date: "May 18, 2023",
      dueDate: "Jun 02, 2023",
      paymentMethod: "PayPal",
      items: [
        { name: "Marketing Strategy", quantity: 1, price: "$1,800.00" },
        { name: "Social Media Campaign", quantity: 1, price: "$1,000.00" }
      ],
      notes: "Please pay within 15 days",
      subtotal: "$2,800.00",
      tax: "$0.00",
      total: "$2,800.00"
    },
    { 
      id: "INV-2023-05-008", 
      client: "Cyberdyne Systems", 
      clientId: "C-008",
      amount: "$5,200.00", 
      status: "Draft", 
      date: "May 15, 2023",
      dueDate: "May 30, 2023",
      paymentMethod: "Bank Transfer",
      items: [
        { name: "AI Development", quantity: 30, price: "$150.00/hr" },
        { name: "Hardware Integration", quantity: 1, price: "$700.00" }
      ],
      notes: "Draft - Not yet sent to client",
      subtotal: "$5,200.00",
      tax: "$0.00",
      total: "$5,200.00"
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    // Filter by status
    if (selectedStatus !== "all" && invoice.status.toLowerCase() !== selectedStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !invoice.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (dateRange === "thisMonth") {
      const currentMonth = new Date().getMonth();
      const invoiceMonth = new Date(invoice.date).getMonth();
      if (currentMonth !== invoiceMonth) {
        return false;
      }
    } else if (dateRange === "lastMonth") {
      const currentMonth = new Date().getMonth();
      const invoiceMonth = new Date(invoice.date).getMonth();
      if ((currentMonth - 1 < 0 ? 11 : currentMonth - 1) !== invoiceMonth) {
        return false;
      }
    }
    
    return true;
  });

  const statusColors = {
    "Paid": "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    "Pending": "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    "Overdue": "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    "Draft": "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    "Cancelled": "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  };

  const statusIcons = {
    "Paid": <CheckCircle size={16} className="mr-1" />,
    "Pending": <Clock size={16} className="mr-1" />,
    "Overdue": <AlertCircle size={16} className="mr-1" />,
    "Draft": <FileText size={16} className="mr-1" />,
    "Cancelled": <Ban size={16} className="mr-1" />
  };

  // Calculate summary statistics
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0);
  const paidInvoices = invoices.filter(invoice => invoice.status === "Paid").length;
  const paidAmount = invoices.filter(invoice => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === "Pending").length;
  const pendingAmount = invoices.filter(invoice => invoice.status === "Pending")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0);
  const overdueInvoices = invoices.filter(invoice => invoice.status === "Overdue").length;
  const overdueAmount = invoices.filter(invoice => invoice.status === "Overdue")
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount.replace('$', '').replace(',', '')), 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Topbar title="Invoice" />
        
        {/* Invoices Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div className="flex items-center">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <h3 className="text-white/90 text-sm font-medium">Total Invoices</h3>
              <p className="text-2xl font-bold text-white mt-1">${totalAmount.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">{totalInvoices} invoices</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <a href="#" className="text-sm text-white/90 hover:text-white flex items-center">
                  View all invoices <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Paid</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${paidAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{paidInvoices} invoices</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
                  View paid invoices <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex items-center text-amber-600 dark:text-amber-400">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+5%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Pending</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pendingInvoices} invoices</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
                  View pending invoices <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <ArrowDownRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">-3%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Overdue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${overdueAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{overdueInvoices} invoices</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center">
                  View overdue invoices <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                <Plus size={18} className="mr-2" />
                New Invoice
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 ${showFilters ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-gray-800'} border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm`}
              >
                <Filter size={18} className={showFilters ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300'} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1 shadow-sm">
              <StatusFilter 
                status="all" 
                label="All" 
                count={invoices.length}
                selected={selectedStatus === "all"} 
                onClick={() => setSelectedStatus("all")} 
              />
              <StatusFilter 
                status="paid" 
                label="Paid" 
                count={invoices.filter(i => i.status === "Paid").length}
                selected={selectedStatus === "paid"} 
                onClick={() => setSelectedStatus("paid")} 
              />
              <StatusFilter 
                status="pending" 
                label="Pending" 
                count={invoices.filter(i => i.status === "Pending").length}
                selected={selectedStatus === "pending"} 
                onClick={() => setSelectedStatus("pending")} 
              />
              <StatusFilter 
                status="overdue" 
                label="Overdue" 
                count={invoices.filter(i => i.status === "Overdue").length}
                selected={selectedStatus === "overdue"} 
                onClick={() => setSelectedStatus("overdue")} 
              />
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                  <select 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2">
                    <option value="all">All Methods</option>
                    <option value="creditCard">Credit Card</option>
                    <option value="bankTransfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Range</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Min" 
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                      type="text" 
                      placeholder="Max" 
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  Reset
                </button>
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoices Table */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden ${selectedInvoice ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <tr 
                          key={invoice.id} 
                          className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 cursor-pointer ${selectedInvoice?.id === invoice.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.id}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{invoice.paymentMethod}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{invoice.client}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {invoice.clientId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.dueDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.amount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${statusColors[invoice.status]}`}>
                              {statusIcons[invoice.status]}
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <Eye size={18} />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <Edit size={18} />
                              </button>
                              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <Download size={18} />
                              </button>
                              <div className="relative group">
                                <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                  <MoreHorizontal size={18} />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                                  <div className="py-1">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Mark as Paid</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Send Reminder</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Duplicate</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No invoices found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                      <span className="font-medium">8</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-emerald-50 dark:bg-emerald-900/20 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Invoice Details */}
            {selectedInvoice && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View and manage invoice information</p>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoice(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedInvoice.id}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created on {selectedInvoice.date}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full flex items-center ${statusColors[selectedInvoice.status]}`}>
                      {statusIcons[selectedInvoice.status]}
                      {selectedInvoice.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.client}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {selectedInvoice.clientId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedInvoice.dueDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Invoice Items</h4>
                  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 dark:bg-gray-750">
                          <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">Subtotal</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">{selectedInvoice.subtotal}</td>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-750">
                          <td colSpan="2" className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">Tax</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">{selectedInvoice.tax}</td>
                        </tr>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                          <td colSpan="2" className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white text-right">Total</td>
                          <td className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white text-right">{selectedInvoice.total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-750 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    {selectedInvoice.notes}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                    <Printer size={16} className="mr-2" />
                    Print
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                    <Send size={16} className="mr-2" />
                    Send
                  </button>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                    <FileCheck size={16} className="mr-2" />
                    Mark as Paid
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 

// Status Filter Button
function StatusFilter({ status, label, count, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm ${
        selected
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label} <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
    </button>
  );
}
