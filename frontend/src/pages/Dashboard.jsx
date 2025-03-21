"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  ClipboardList,
  FileText,
  Bell,
  ChevronRight,
  PlusCircle,
  Search,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const data = [
    { month: "Jan", quotations: 30, invoices: 25 },
    { month: "Feb", quotations: 50, invoices: 45 },
    { month: "Mar", quotations: 80, invoices: 65 },
    { month: "Apr", quotations: 45, invoices: 40 },
    { month: "May", quotations: 90, invoices: 75 },
    { month: "Jun", quotations: 60, invoices: 55 },
  ];

  const recentQuotations = [
    {
      id: "Q-2023-06-001",
      client: "Acme Inc.",
      amount: "$2,450.00",
      status: "Pending",
      date: "Jun 15, 2023",
    },
    {
      id: "Q-2023-06-002",
      client: "Globex Corp.",
      amount: "$1,850.00",
      status: "Approved",
      date: "Jun 12, 2023",
    },
    {
      id: "Q-2023-06-003",
      client: "Stark Industries",
      amount: "$3,200.00",
      status: "Pending",
      date: "Jun 10, 2023",
    },
    {
      id: "Q-2023-05-012",
      client: "Wayne Enterprises",
      amount: "$4,500.00",
      status: "Approved",
      date: "May 28, 2023",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome back, Alex!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Here's what's happening with your business today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value="1,200"
              change="+12%"
              isPositive={true}
              icon={
                <Users
                  size={24}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              }
            />
            <StatCard
              title="Pending Quotations"
              value="245"
              change="+8%"
              isPositive={true}
              icon={
                <ClipboardList
                  size={24}
                  className="text-amber-600 dark:text-amber-400"
                />
              }
            />
            <StatCard
              title="Approved Invoices"
              value="860"
              change="+15%"
              isPositive={true}
              icon={
                <FileText
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />
              }
            />
            <StatCard
              title="Monthly Revenue"
              value="$24,500"
              change="-3%"
              isPositive={false}
              icon={
                <CreditCard
                  size={24}
                  className="text-purple-600 dark:text-purple-400"
                />
              }
            />
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
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "reports"
                  ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Reports
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Quotations & Invoices
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Quotations
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Invoices
                    </span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="quotations"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="invoices"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Quotations
                </h3>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
                  View all <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {recentQuotations.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {quote.client}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {quote.id}
                        </p>
                      </div>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          quote.status === "Approved"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {quote.amount}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {quote.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors duration-200 flex items-center justify-center">
                <PlusCircle size={16} className="mr-2" />
                Create New Quotation
              </button>
            </div>
          </div>

          {/* Calendar and Tasks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Calendar
                    size={20}
                    className="mr-2 text-emerald-600 dark:text-emerald-400"
                  />
                  Upcoming
                </h3>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
                  View calendar
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex flex-col items-center justify-center text-purple-600 dark:text-purple-400">
                    <span className="text-xs font-medium">JUN</span>
                    <span className="text-lg font-bold">18</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Client Meeting
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Acme Inc. - Project Discussion
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      10:00 AM - 11:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-medium">JUN</span>
                    <span className="text-lg font-bold">20</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Proposal Deadline
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Globex Corp. - Website Redesign
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      End of Day
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex flex-col items-center justify-center text-amber-600 dark:text-amber-400">
                    <span className="text-xs font-medium">JUN</span>
                    <span className="text-lg font-bold">22</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Team Review
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monthly Performance Review
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      2:00 PM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Tasks & Reminders
                </h3>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
                  <PlusCircle size={16} className="mr-1" />
                  Add Task
                </button>
              </div>

              <div className="space-y-4">
                <Task
                  title="Follow up with Stark Industries"
                  description="Send a follow-up email regarding the pending quotation"
                  dueDate="Today"
                  priority="High"
                />
                <Task
                  title="Prepare monthly invoice report"
                  description="Compile all invoices from the past month for the finance team"
                  dueDate="Tomorrow"
                  priority="Medium"
                />
                <Task
                  title="Update client database"
                  description="Add new client information and update existing records"
                  dueDate="Jun 19"
                  priority="Low"
                />
                <Task
                  title="Review new quotation templates"
                  description="Check the new templates designed by the marketing team"
                  dueDate="Jun 20"
                  priority="Medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Dashboard Stat Card
function StatCard({ title, value, change, isPositive, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {icon}
        </div>
        <div
          className={`flex items-center ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          } text-sm font-medium`}
        >
          {change}
          {isPositive ? (
            <ArrowUpRight size={16} className="ml-1" />
          ) : (
            <ArrowDownRight size={16} className="ml-1" />
          )}
        </div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
    </div>
  );
}

// Task Component
function Task({ title, description, dueDate, priority }) {
  const priorityColors = {
    High: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    Medium:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    Low: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  };

  return (
    <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <span
          className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}
        >
          {priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={14} className="mr-1" />
          Due: {dueDate}
        </div>
        <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
          Mark Complete
        </button>
      </div>
    </div>
  );
}
