"use client"

import { useState } from "react"
import {
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ChevronRight,
  Plus,
  BarChart2,
  CheckCircle,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  UserPlus,
} from "lucide-react"
import { getUserFromToken } from "../services/GetUserFromToken"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const user = getUserFromToken()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome back,{user.name}</h2>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your business today.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "overview"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewContent />}
    </div>
  )
}

// Overview Content Component
const OverviewContent = () => {
  // Sample data for charts
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 2780 },
    { month: "May", sales: 1890 },
    { month: "Jun", sales: 2390 },
    { month: "Jul", sales: 3490 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value="1,248"
          change="+12%"
          isPositive={true}
          icon={<Users size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Active Quotations"
          value="156"
          change="+8%"
          isPositive={true}
          icon={<ClipboardList size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Pending RFQs"
          value="43"
          change="+15%"
          isPositive={true}
          icon={<FileText size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Monthly Revenue"
          value="$48,500"
          change="+23%"
          isPositive={true}
          icon={<CreditCard size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <ActivityItem
              title="New Customer"
              description="John Doe registered as a new customer"
              time="2 hours ago"
              icon={<UserPlus size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="Quotation Approved"
              description="Quotation #Q-2023-002 was approved by client"
              time="4 hours ago"
              icon={<CheckCircle size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="Invoice Paid"
              description="Invoice #INV-2023-045 was paid ($1,200.00)"
              time="Yesterday"
              icon={<CreditCard size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="New RFQ"
              description="New RFQ #RFQ-2023-018 was submitted"
              time="2 days ago"
              icon={<FileText size={16} />}
              iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>

        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Overview</h3>
            <div className="flex space-x-2">
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <BarChart2 size={48} className="mx-auto mb-2 opacity-50" />
              <p>Sales chart visualization would appear here</p>
              <p className="text-sm">Using data from the selected time period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Customers</h3>
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                      JD
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">John Doe</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Acme Inc.</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">john@acme.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">Acme Inc.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                      JS
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Jane Smith</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Globex Corp.</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">jane@globex.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">Globex Corp.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                      RJ
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Robert Johnson</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Stark Industries</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">robert@stark.com</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">Stark Industries</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


// Helper Components
const StatCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">{icon}</div>
        <div
          className={`flex items-center ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} text-sm font-medium`}
        >
          {change}
          {isPositive ? <ArrowUpRight size={16} className="ml-1" /> : <ArrowDownRight size={16} className="ml-1" />}
        </div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  )
}

// Activity Item Component
const ActivityItem = ({ title, description, time, icon, iconBg }) => {
  return (
    <div className="flex items-start">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

