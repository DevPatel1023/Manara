"use client"

import { useState } from "react"
import {
  Menu,
  X,
  Home,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import Topbar from "../components/TopBar"

export default function Quotations() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const quotations = [
    {
      id: "Q-2023-06-001",
      client: "Acme Inc.",
      amount: "$2,450.00",
      status: "Pending",
      date: "Jun 15, 2023",
      dueDate: "Jun 30, 2023",
      items: 5,
    },
    {
      id: "Q-2023-06-002",
      client: "Globex Corp.",
      amount: "$1,850.00",
      status: "Approved",
      date: "Jun 12, 2023",
      dueDate: "Jun 27, 2023",
      items: 3,
    },
    {
      id: "Q-2023-06-003",
      client: "Stark Industries",
      amount: "$3,200.00",
      status: "Pending",
      date: "Jun 10, 2023",
      dueDate: "Jun 25, 2023",
      items: 7,
    },
    {
      id: "Q-2023-05-012",
      client: "Wayne Enterprises",
      amount: "$4,500.00",
      status: "Approved",
      date: "May 28, 2023",
      dueDate: "Jun 12, 2023",
      items: 9,
    },
    {
      id: "Q-2023-05-011",
      client: "Oscorp Industries",
      amount: "$1,200.00",
      status: "Declined",
      date: "May 25, 2023",
      dueDate: "Jun 09, 2023",
      items: 2,
    },
    {
      id: "Q-2023-05-010",
      client: "Umbrella Corporation",
      amount: "$3,750.00",
      status: "Approved",
      date: "May 22, 2023",
      dueDate: "Jun 06, 2023",
      items: 6,
    },
    {
      id: "Q-2023-05-009",
      client: "LexCorp",
      amount: "$2,800.00",
      status: "Expired",
      date: "May 18, 2023",
      dueDate: "Jun 02, 2023",
      items: 4,
    },
    {
      id: "Q-2023-05-008",
      client: "Cyberdyne Systems",
      amount: "$5,200.00",
      status: "Draft",
      date: "May 15, 2023",
      dueDate: "May 30, 2023",
      items: 8,
    },
  ]

  const filteredQuotations = quotations.filter((quote) => {
    // Filter by status
    if (selectedStatus !== "all" && quote.status.toLowerCase() !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !quote.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quote.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const statusColors = {
    Approved: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    Declined: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    Draft: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    Expired: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Topbar title="Quotations" />

        {/* Quotations Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center">
                <Plus size={18} className="mr-2" />
                New Quotation
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <Filter size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
              <StatusFilter
                status="all"
                label="All"
                count={quotations.length}
                selected={selectedStatus === "all"}
                onClick={() => setSelectedStatus("all")}
              />
              <StatusFilter
                status="pending"
                label="Pending"
                count={quotations.filter((q) => q.status === "Pending").length}
                selected={selectedStatus === "pending"}
                onClick={() => setSelectedStatus("pending")}
              />
              <StatusFilter
                status="approved"
                label="Approved"
                count={quotations.filter((q) => q.status === "Approved").length}
                selected={selectedStatus === "approved"}
                onClick={() => setSelectedStatus("approved")}
              />
              <StatusFilter
                status="declined"
                label="Declined"
                count={quotations.filter((q) => q.status === "Declined").length}
                selected={selectedStatus === "declined"}
                onClick={() => setSelectedStatus("declined")}
              />
              <StatusFilter
                status="draft"
                label="Draft"
                count={quotations.filter((q) => q.status === "Draft").length}
                selected={selectedStatus === "draft"}
                onClick={() => setSelectedStatus("draft")}
              />
            </div>
          </div>

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
                      Due Date
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
                  {filteredQuotations.length > 0 ? (
                    filteredQuotations.map((quote) => (
                      <tr
                        key={quote.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.id}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{quote.items} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{quote.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{quote.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{quote.dueDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{quote.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[quote.status]}`}>
                            {quote.status}
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
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    Convert to Invoice
                                  </a>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    Duplicate
                                  </a>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    Delete
                                  </a>
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
                        No quotations found matching your criteria
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
                    Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                    <span className="font-medium">20</span> results
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
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      3
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ...
                    </span>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      8
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
        </div>
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

