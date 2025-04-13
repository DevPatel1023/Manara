"use client"

import { useState } from "react"
import {
  ClipboardList,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
  MessageSquare,
  CheckSquare,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { getUserFromToken } from "../services/GetUserFromToken"

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const user = getUserFromToken()
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome back, {user.name}</h2>
        <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your tasks and schedule today.</p>
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
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "tasks"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "calendar"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "customers"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "messages"
              ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewContent />}
      {activeTab === "tasks" && <TasksContent />}
      {activeTab === "calendar" && <CalendarContent />}
      {activeTab === "customers" && <CustomersContent />}
      {activeTab === "messages" && <MessagesContent />}
    </div>
  )
}

// Overview Content Component
const OverviewContent = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tasks Completed"
          value="24"
          change="+8"
          isPositive={true}
          icon={<CheckSquare size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Pending Tasks"
          value="12"
          change="-3"
          isPositive={true}
          icon={<ClipboardList size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Meetings Today"
          value="4"
          change="+1"
          isPositive={true}
          icon={<Calendar size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="New Messages"
          value="8"
          change="+3"
          isPositive={true}
          icon={<MessageSquare size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Tasks</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <TaskItem title="Prepare quotation for ABC Corp" priority="High" dueTime="11:00 AM" status="pending" />
            <TaskItem title="Call with XYZ client" priority="Medium" dueTime="2:30 PM" status="pending" />
            <TaskItem title="Review RFQ submissions" priority="High" dueTime="4:00 PM" status="pending" />
            <TaskItem title="Update customer database" priority="Low" dueTime="5:00 PM" status="pending" />
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Meetings</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <MeetingItem
              title="Team Standup"
              time="10:00 AM - 10:30 AM"
              location="Conference Room A"
              participants={4}
            />
            <MeetingItem
              title="Client Presentation"
              time="1:00 PM - 2:00 PM"
              location="Zoom Meeting"
              participants={6}
            />
            <MeetingItem
              title="Project Review"
              time="3:30 PM - 4:30 PM"
              location="Conference Room B"
              participants={5}
            />
            <MeetingItem title="Weekly Wrap-up" time="5:00 PM - 5:30 PM" location="Main Office" participants={12} />
          </div>
        </div>

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
              title="Task Completed"
              description="You completed the task 'Prepare monthly report'"
              time="2 hours ago"
              icon={<CheckCircle size={16} />}
              iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
            />
            <ActivityItem
              title="New Message"
              description="You received a message from John Doe"
              time="3 hours ago"
              icon={<MessageSquare size={16} />}
              iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            />
            <ActivityItem
              title="Meeting Reminder"
              description="Client meeting in 30 minutes"
              time="4 hours ago"
              icon={<Clock size={16} />}
              iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            />
            <ActivityItem
              title="Task Assigned"
              description="Manager assigned you a new task"
              time="Yesterday"
              icon={<ClipboardList size={16} />}
              iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
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

// Tasks Content Component
const TasksContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Filter size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center">
            <Plus size={18} className="mr-2" />
            New Task
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Due Date
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
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {index % 4 === 0
                        ? "Prepare quotation for client"
                        : index % 4 === 1
                          ? "Follow up with customer inquiry"
                          : index % 4 === 2
                            ? "Update product documentation"
                            : "Schedule client meeting"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        index % 3 === 0
                          ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          : index % 3 === 1
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{`Jul ${10 + index}, 2023`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        index % 4 === 0
                          ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : index % 4 === 1
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            : index % 4 === 2
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {index % 4 === 0
                        ? "Completed"
                        : index % 4 === 1
                          ? "In Progress"
                          : index % 4 === 2
                            ? "Pending"
                            : "Not Started"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
            <span className="font-medium">36</span> tasks
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Calendar Content Component
const CalendarContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Calendar</h2>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center">
            <Plus size={18} className="mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">July 2023</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              <ChevronRight size={16} className="transform rotate-180 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="h-96 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Calendar size={48} className="mx-auto mb-2 opacity-50" />
            <p>Calendar visualization would appear here</p>
            <p className="text-sm">Showing your meetings and events for the month</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Upcoming Events</h3>
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <MeetingItem
            title="Team Standup"
            time="Today, 10:00 AM - 10:30 AM"
            location="Conference Room A"
            participants={4}
          />
          <MeetingItem
            title="Client Presentation"
            time="Today, 1:00 PM - 2:00 PM"
            location="Zoom Meeting"
            participants={6}
          />
          <MeetingItem
            title="Project Review"
            time="Today, 3:30 PM - 4:30 PM"
            location="Conference Room B"
            participants={5}
          />
          <MeetingItem
            title="Weekly Wrap-up"
            time="Today, 5:00 PM - 5:30 PM"
            location="Main Office"
            participants={12}
          />
          <MeetingItem
            title="Marketing Strategy"
            time="Tomorrow, 11:00 AM - 12:00 PM"
            location="Conference Room C"
            participants={8}
          />
        </div>
      </div>
    </div>
  )
}

// Customers Content Component
const CustomersContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Customers</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Filter size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                        {index % 3 === 0 ? "JD" : index % 3 === 1 ? "JS" : "RJ"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {index % 3 === 0 ? "John Doe" : index % 3 === 1 ? "Jane Smith" : "Robert Johnson"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {index % 3 === 0 ? "john@acme.com" : index % 3 === 1 ? "jane@globex.com" : "robert@stark.com"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {index % 3 === 0 ? "Acme Inc." : index % 3 === 1 ? "Globex Corp." : "Stark Industries"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        index % 5 === 0
                          ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {index % 5 === 0 ? "Pending" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
            <span className="font-medium">42</span> customers
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Messages Content Component
const MessagesContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Messages</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center">
            <Plus size={18} className="mr-2" />
            New Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Conversations</h3>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                  index === 0 ? "bg-gray-50 dark:bg-gray-750" : ""
                }`}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                    {index % 3 === 0 ? "JD" : index % 3 === 1 ? "JS" : "RJ"}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {index % 3 === 0 ? "John Doe" : index % 3 === 1 ? "Jane Smith" : "Robert Johnson"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{`${index + 1}h ago`}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {index % 4 === 0
                        ? "Hi there, I wanted to follow up on our last meeting..."
                        : index % 4 === 1
                          ? "Can you send me the latest quotation for our project?"
                          : index % 4 === 2
                            ? "Thanks for your help with the recent order!"
                            : "When can we schedule a call to discuss the proposal?"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                JD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Acme Inc.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-4">
            <div className="flex items-end">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs">
                JD
              </div>
              <div className="ml-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Hi there, I wanted to follow up on our last meeting. Have you had a chance to review the proposal?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10:30 AM</p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="mr-2 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg rounded-br-none max-w-[80%]">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Yes, I've reviewed it and have a few questions. Can we schedule a call tomorrow?
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">10:45 AM</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                ME
              </div>
            </div>
            <div className="flex items-end">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs">
                JD
              </div>
              <div className="ml-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Sure, that works for me. How about 2 PM tomorrow?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">11:00 AM</p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <div className="mr-2 bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg rounded-br-none max-w-[80%]">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Perfect. I'll send a calendar invite shortly.
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">11:05 AM</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold text-xs">
                ME
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-transparent"
              />
              <button className="ml-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
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

// Task Item Component
const TaskItem = ({ title, priority, dueTime, status }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
      <div className="flex items-center">
        <div
          className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
            priority === "High" ? "bg-red-500" : priority === "Medium" ? "bg-amber-500" : "bg-blue-500"
          }`}
        ></div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Due {dueTime}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span
          className={`px-2 py-1 text-xs rounded-full mr-2 ${
            status === "completed"
              ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
          }`}
        >
          {status === "completed" ? "Completed" : "Pending"}
        </span>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}

// Meeting Item Component
const MeetingItem = ({ title, time, location, participants }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-3 flex-shrink-0">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex -space-x-2 mr-2">
          {[...Array(Math.min(3, participants))].map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-semibold"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {participants > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-semibold">
              +{participants - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard

