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

      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewContent />}
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

