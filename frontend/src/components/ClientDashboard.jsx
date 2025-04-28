"use client"

import { useState } from "react"
import {
  FileText,
  ClipboardList,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ChevronRight,
  Plus,
  CreditCardIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { getUserFromToken } from "../services/GetUserFromToken";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const user = getUserFromToken()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome back, {user?.name }</h2>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your account.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
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
  const StatCard = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
        <div
          className={`text-sm font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} flex items-center`}
        >
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ title, description, time, icon, iconBg }) => (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${iconBg}`}>{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">{time}</div>
    </div>
  )

  const PaymentItem = ({ invoiceNumber, amount, dueDate, status }) => (
    <div className="flex items-center">
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{invoiceNumber}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">Due {dueDate}</p>
      </div>
      <div className="ml-auto">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{amount}</p>
        <span
          className={`px-2 py-1 text-xs rounded-full ${status === "overdue" ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"}`}
        >
          {status === "overdue" ? "Overdue" : "Upcoming"}
        </span>
      </div>
    </div>
  )

  const QuotationItem = ({ quotationNumber, amount, date, status }) => (
    <div className="flex items-center">
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{quotationNumber}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <div className="ml-auto">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{amount}</p>
        <span
          className={`px-2 py-1 text-xs rounded-full ${status === "approved" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"}`}
        >
          {status}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Quotations"
          value="12"
          change="+2"
          isPositive={true}
          icon={<ClipboardList size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Pending RFQs"
          value="5"
          change="+1"
          isPositive={true}
          icon={<FileText size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Open Invoices"
          value="8"
          change="-2"
          isPositive={false}
          icon={<CreditCard size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Total Spent"
          value="$24,500"
          change="+$2,100"
          isPositive={true}
          icon={<CreditCardIcon size={24} className="text-emerald-600 dark:text-emerald-400" />}
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
              title="Quotation Approved"
              description="Your quotation #Q-2023-002 was approved"
              time="2 hours ago"
              icon={<CheckCircle size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="New Invoice"
              description="You received invoice #INV-2023-045"
              time="4 hours ago"
              icon={<FileText size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="Payment Due"
              description="Payment for invoice #INV-2023-043 is due"
              time="Yesterday"
              icon={<AlertCircle size={16} />}
              iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />
            <ActivityItem
              title="RFQ Submitted"
              description="Your RFQ #RFQ-2023-007 was submitted"
              time="2 days ago"
              icon={<ClipboardList size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Payments</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <PaymentItem invoiceNumber="INV-2023-045" amount="$1,200.00" dueDate="Jul 25, 2023" status="upcoming" />
            <PaymentItem invoiceNumber="INV-2023-044" amount="$850.00" dueDate="Jul 28, 2023" status="upcoming" />
            <PaymentItem invoiceNumber="INV-2023-043" amount="$2,100.00" dueDate="Jul 15, 2023" status="overdue" />
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Quotations</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <QuotationItem quotationNumber="Q-2023-005" amount="$3,500.00" date="Jul 10, 2023" status="approved" />
            <QuotationItem quotationNumber="Q-2023-004" amount="$1,800.00" date="Jul 5, 2023" status="pending" />
            <QuotationItem quotationNumber="Q-2023-003" amount="$2,200.00" date="Jun 28, 2023" status="approved" />
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Invoices</h3>
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
                  Invoice
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Amount
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
                  <div className="text-sm font-medium text-gray-900 dark:text-white">INV-2023-045</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Jul 10, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">$1,200.00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 mr-3">
                    View
                  </button>
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-md">
                    Pay Now
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">INV-2023-044</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Jul 5, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">$850.00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 mr-3">
                    View
                  </button>
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-md">
                    Pay Now
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">INV-2023-043</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Jun 28, 2023</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">$2,100.00</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    Overdue
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 mr-3">
                    View
                  </button>
                  <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-md">
                    Pay Now
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


export default ClientDashboard

