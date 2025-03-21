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
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  UserPlus,
  Download,
  Star,
  MessageSquare,
  BarChart3,
  Building,
  User,
  ChevronDown,
  ArrowUpRight,
  Briefcase,
} from "lucide-react"
import SideBar from "../components/SideBar"
import Header from "../components/Header"

export default function Customers() {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState("grid")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const customers = [
    {
      id: 1,
      name: "Acme Inc.",
      contactPerson: "John Smith",
      email: "john@acmeinc.com",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      totalSpent: "$12,450.00",
      activeQuotes: 2,
      activeInvoices: 3,
      status: "Active",
      joinDate: "Jan 15, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Technology",
      website: "www.acmeinc.com",
      rating: 5,
      notes: "Key client with multiple ongoing projects. Prefers communication via email.",
      recentActivity: [
        { type: "invoice", action: "paid", date: "Jun 15, 2023", amount: "$2,450.00", id: "INV-2023-06-001" },
        { type: "quote", action: "created", date: "Jun 10, 2023", amount: "$3,200.00", id: "Q-2023-06-003" },
        {
          type: "note",
          action: "added",
          date: "Jun 5, 2023",
          content: "Client requested a meeting to discuss new project",
        },
        { type: "invoice", action: "sent", date: "May 28, 2023", amount: "$4,500.00", id: "INV-2023-05-012" },
      ],
    },
    {
      id: 2,
      name: "Globex Corp.",
      contactPerson: "Jane Doe",
      email: "jane@globexcorp.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, USA",
      totalSpent: "$8,750.00",
      activeQuotes: 1,
      activeInvoices: 2,
      status: "Active",
      joinDate: "Feb 22, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Manufacturing",
      website: "www.globexcorp.com",
      rating: 4,
      notes: "Expanding client with international presence. Prefers phone calls over emails.",
      recentActivity: [
        { type: "invoice", action: "sent", date: "Jun 12, 2023", amount: "$1,850.00", id: "INV-2023-06-002" },
        { type: "quote", action: "approved", date: "Jun 5, 2023", amount: "$1,850.00", id: "Q-2023-06-002" },
        { type: "note", action: "added", date: "May 30, 2023", content: "Discussed potential expansion of services" },
      ],
    },
    {
      id: 3,
      name: "Stark Industries",
      contactPerson: "Tony Stark",
      email: "tony@starkindustries.com",
      phone: "+1 (555) 111-2222",
      location: "Los Angeles, USA",
      totalSpent: "$24,300.00",
      activeQuotes: 3,
      activeInvoices: 1,
      status: "Active",
      joinDate: "Mar 10, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Defense",
      website: "www.starkindustries.com",
      rating: 5,
      notes: "Premium client with high-value projects. Direct contact with CEO.",
      recentActivity: [
        { type: "quote", action: "created", date: "Jun 10, 2023", amount: "$3,200.00", id: "Q-2023-06-003" },
        { type: "invoice", action: "overdue", date: "Jun 10, 2023", amount: "$3,200.00", id: "INV-2023-06-003" },
        { type: "meeting", action: "scheduled", date: "Jun 20, 2023", content: "Quarterly review meeting" },
      ],
    },
    {
      id: 4,
      name: "Wayne Enterprises",
      contactPerson: "Bruce Wayne",
      email: "bruce@wayneenterprises.com",
      phone: "+1 (555) 333-4444",
      location: "Gotham City, USA",
      totalSpent: "$18,900.00",
      activeQuotes: 0,
      activeInvoices: 4,
      status: "Active",
      joinDate: "Apr 5, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Conglomerate",
      website: "www.wayneenterprises.com",
      rating: 5,
      notes: "Long-term client with diverse portfolio. Requires detailed reporting.",
      recentActivity: [
        { type: "invoice", action: "paid", date: "May 28, 2023", amount: "$4,500.00", id: "INV-2023-05-012" },
        { type: "note", action: "added", date: "May 25, 2023", content: "Discussed expansion into new markets" },
        { type: "meeting", action: "completed", date: "May 20, 2023", content: "Project kickoff meeting" },
      ],
    },
    {
      id: 5,
      name: "Oscorp Industries",
      contactPerson: "Norman Osborn",
      email: "norman@oscorp.com",
      phone: "+1 (555) 555-6666",
      location: "New York, USA",
      totalSpent: "$7,200.00",
      activeQuotes: 1,
      activeInvoices: 0,
      status: "Inactive",
      joinDate: "May 18, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Research",
      website: "www.oscorp.com",
      rating: 3,
      notes: "Currently on hold due to internal restructuring. Follow up in Q3.",
      recentActivity: [
        { type: "invoice", action: "cancelled", date: "May 25, 2023", amount: "$1,200.00", id: "INV-2023-05-011" },
        { type: "note", action: "added", date: "May 20, 2023", content: "Client requested to pause all projects" },
      ],
    },
    {
      id: 6,
      name: "Umbrella Corporation",
      contactPerson: "Albert Wesker",
      email: "wesker@umbrella.com",
      phone: "+1 (555) 777-8888",
      location: "Raccoon City, USA",
      totalSpent: "$15,750.00",
      activeQuotes: 2,
      activeInvoices: 2,
      status: "Active",
      joinDate: "Jun 1, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Pharmaceuticals",
      website: "www.umbrella.com",
      rating: 4,
      notes: "Sensitive client requiring strict confidentiality. NDA in place.",
      recentActivity: [
        { type: "invoice", action: "paid", date: "May 22, 2023", amount: "$3,750.00", id: "INV-2023-05-010" },
        { type: "quote", action: "created", date: "May 15, 2023", amount: "$2,800.00", id: "Q-2023-05-009" },
      ],
    },
    {
      id: 7,
      name: "LexCorp",
      contactPerson: "Lex Luthor",
      email: "lex@lexcorp.com",
      phone: "+1 (555) 999-0000",
      location: "Metropolis, USA",
      totalSpent: "$9,800.00",
      activeQuotes: 1,
      activeInvoices: 1,
      status: "Active",
      joinDate: "Jun 15, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "Technology",
      website: "www.lexcorp.com",
      rating: 4,
      notes: "Competitive client with high expectations. Requires weekly updates.",
      recentActivity: [
        { type: "invoice", action: "pending", date: "May 18, 2023", amount: "$2,800.00", id: "INV-2023-05-009" },
        { type: "meeting", action: "scheduled", date: "Jun 25, 2023", content: "Project review meeting" },
      ],
    },
    {
      id: 8,
      name: "Cyberdyne Systems",
      contactPerson: "Miles Dyson",
      email: "miles@cyberdyne.com",
      phone: "+1 (555) 222-3333",
      location: "Los Angeles, USA",
      totalSpent: "$11,200.00",
      activeQuotes: 0,
      activeInvoices: 0,
      status: "Inactive",
      joinDate: "Jul 1, 2023",
      avatar: "/placeholder.svg?height=100&width=100",
      industry: "AI & Robotics",
      website: "www.cyberdyne.com",
      rating: 2,
      notes: "Currently inactive. Previous projects were put on hold due to regulatory issues.",
      recentActivity: [
        { type: "invoice", action: "draft", date: "May 15, 2023", amount: "$5,200.00", id: "INV-2023-05-008" },
        { type: "note", action: "added", date: "May 10, 2023", content: "Client requested to pause all development" },
      ],
    },
  ]

  const filteredCustomers = customers.filter((customer) => {
    if (
      searchQuery &&
      !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Calculate summary statistics
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "Active").length
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + Number.parseFloat(customer.totalSpent.replace("$", "").replace(",", "")),
    0,
  )
  const averageRevenue = totalRevenue / totalCustomers

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
     <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Customers Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div className="flex items-center">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>
              <h3 className="text-white/90 text-sm font-medium">Total Customers</h3>
              <p className="text-2xl font-bold text-white mt-1">{totalCustomers}</p>
              <p className="text-sm text-white/80 mt-1">{activeCustomers} active</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <a href="#" className="text-sm text-white/90 hover:text-white flex items-center">
                  View all customers
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+8%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Active Customers</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeCustomers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((activeCustomers / totalCustomers) * 100)}% of total
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center"
                >
                  View active customers
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <CreditCard size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+12%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">From all customers</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center"
                >
                  View revenue details
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <BarChart3 size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex items-center text-amber-600 dark:text-amber-400">
                  <ArrowUpRight size={18} className="mr-1" />
                  <span className="text-sm font-medium">+5%</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Average Revenue</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${averageRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Per customer</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="#"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center"
                >
                  View analytics
                </a>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                <UserPlus size={18} className="mr-2" />
                Add Customer
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 ${showFilters ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-white dark:bg-gray-800"} border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm`}
              >
                <Filter
                  size={18}
                  className={
                    showFilters ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-300"
                  }
                />
              </button>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                {filteredCustomers.length} customers
              </span>
              <div className="relative">
                <button className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm">
                  <span>Sort by</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Name (A-Z)
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Name (Z-A)
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Newest first
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Oldest first
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Highest revenue
                    </a>
                  </div>
                </div>
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2">
                    <option value="all">All Industries</option>
                    <option value="technology">Technology</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="defense">Defense</option>
                    <option value="pharmaceuticals">Pharmaceuticals</option>
                    <option value="research">Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Rating
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2">
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars & Above</option>
                    <option value="3">3 Stars & Above</option>
                  </select>
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
            {/* Customers Grid/List View */}
            <div className={`${selectedCustomer ? "lg:col-span-2" : "lg:col-span-3"}`}>
              {selectedView === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${selectedCustomer?.id === customer.id ? "ring-2 ring-emerald-500 dark:ring-emerald-400" : ""}`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                              <img
                                src={customer.avatar || "/placeholder.svg"}
                                alt={customer.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{customer.contactPerson}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              customer.status === "Active"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Mail size={16} className="mr-2 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MapPin size={16} className="mr-2 text-gray-400" />
                            {customer.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Briefcase size={16} className="mr-2 text-gray-400" />
                            {customer.industry}
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < customer.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.totalSpent}</p>
                          </div>
                          <div className="flex space-x-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Quotes</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {customer.activeQuotes}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Invoices</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {customer.activeInvoices}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Eye size={18} />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Edit size={18} />
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
                                  Create Quote
                                </a>
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Create Invoice
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Industry
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total Spent
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
                        {filteredCustomers.map((customer) => (
                          <tr
                            key={customer.id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                                  <img
                                    src={customer.avatar || "/placeholder.svg"}
                                    alt={customer.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {customer.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Since {customer.joinDate}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{customer.contactPerson}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{customer.email}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{customer.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">{customer.industry}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {customer.totalSpent}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  customer.status === "Active"
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                }`}
                              >
                                {customer.status}
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
                                        Create Quote
                                      </a>
                                      <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        Create Invoice
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
                        ))}
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
                          <span className="font-medium">8</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
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
              )}
            </div>

            {/* Customer Details */}
            {selectedCustomer && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View and manage customer information</p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img
                      src={selectedCustomer.avatar || "/placeholder.svg"}
                      alt={selectedCustomer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCustomer.industry}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < selectedCustomer.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="-mb-px flex space-x-6">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`py-2 text-sm font-medium ${
                        activeTab === "overview"
                          ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`py-2 text-sm font-medium ${
                        activeTab === "activity"
                          ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Activity
                    </button>
                    <button
                      onClick={() => setActiveTab("quotes")}
                      className={`py-2 text-sm font-medium ${
                        activeTab === "quotes"
                          ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Quotes
                    </button>
                    <button
                      onClick={() => setActiveTab("invoices")}
                      className={`py-2 text-sm font-medium ${
                        activeTab === "invoices"
                          ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Invoices
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className={`py-2 text-sm font-medium ${
                        activeTab === "notes"
                          ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Notes
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Contact Information
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <User size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.contactPerson}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.location}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Globe size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.website}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Business Information
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Building size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedCustomer.industry}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Client since {selectedCustomer.joinDate}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CreditCard size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Total spent: {selectedCustomer.totalSpent}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <ClipboardList size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {selectedCustomer.activeQuotes} active quotes
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FileText size={16} className="mr-2 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {selectedCustomer.activeInvoices} active invoices
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notes</h5>
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer.notes}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <Edit size={16} className="mr-2" />
                        Edit Customer
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <ClipboardList size={16} className="mr-2" />
                        Create Quote
                      </button>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <FileText size={16} className="mr-2" />
                        Create Invoice
                      </button>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <MessageSquare size={16} className="mr-2" />
                        Add Note
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Activity</h5>
                    <div className="space-y-4">
                      {selectedCustomer.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              activity.type === "invoice"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : activity.type === "quote"
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {activity.type === "invoice" ? (
                              <FileText size={16} />
                            ) : activity.type === "quote" ? (
                              <ClipboardList size={16} />
                            ) : activity.type === "note" ? (
                              <MessageSquare size={16} />
                            ) : (
                              <Calendar size={16} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {activity.type === "invoice"
                                    ? `Invoice ${activity.id} ${activity.action}`
                                    : activity.type === "quote"
                                      ? `Quote ${activity.id} ${activity.action}`
                                      : activity.type === "note"
                                        ? "Note added"
                                        : `Meeting ${activity.action}`}
                                </p>
                                {activity.amount && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{activity.amount}</p>
                                )}
                                {activity.content && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{activity.content}</p>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "quotes" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quotes</h5>
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <Plus size={14} className="mr-1" />
                        New Quote
                      </button>
                    </div>

                    {selectedCustomer.activeQuotes > 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedCustomer.recentActivity
                              .filter((activity) => activity.type === "quote")
                              .map((quote, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{quote.id}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{quote.date}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{quote.amount}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        quote.action === "approved"
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                      }`}
                                    >
                                      {quote.action === "approved" ? "Approved" : "Created"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Eye size={16} />
                                      </button>
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Edit size={16} />
                                      </button>
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Download size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No quotes found for this customer</p>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center shadow-sm">
                          <Plus size={16} className="mr-2" />
                          Create Quote
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "invoices" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoices</h5>
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <Plus size={14} className="mr-1" />
                        New Invoice
                      </button>
                    </div>

                    {selectedCustomer.activeInvoices > 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {selectedCustomer.recentActivity
                              .filter((activity) => activity.type === "invoice")
                              .map((invoice, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{invoice.id}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{invoice.date}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{invoice.amount}</td>
                                  <td className="px-4 py-2 text-sm">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        invoice.action === "paid"
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                          : invoice.action === "pending"
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                                            : invoice.action === "overdue"
                                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                      }`}
                                    >
                                      {invoice.action.charAt(0).toUpperCase() + invoice.action.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-sm text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Eye size={16} />
                                      </button>
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Edit size={16} />
                                      </button>
                                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Download size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No invoices found for this customer</p>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center shadow-sm">
                          <Plus size={16} className="mr-2" />
                          Create Invoice
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "notes" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</h5>
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                        <Plus size={14} className="mr-1" />
                        Add Note
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedCustomer.recentActivity
                        .filter((activity) => activity.type === "note")
                        .map((note, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="text-sm font-medium text-gray-900 dark:text-white">Note</h6>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{note.content}</p>
                          </div>
                        ))}

                      <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="text-sm font-medium text-gray-900 dark:text-white">General Notes</h6>
                          <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCustomer.notes}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Add a new note
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 h-24 resize-none"
                        placeholder="Type your note here..."
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center shadow-sm">
                          <Plus size={16} className="mr-2" />
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Missing Globe component
function Globe(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

