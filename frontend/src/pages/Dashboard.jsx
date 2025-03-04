
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Menu, X, Home, Users, ClipboardList, FileText, Bell, Settings } from "lucide-react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);

  const data = [
    { month: "Jan", quotations: 30 },
    { month: "Feb", quotations: 50 },
    { month: "Mar", quotations: 80 },
    { month: "Apr", quotations: 45 },
    { month: "May", quotations: 90 },
    { month: "Jun", quotations: 60 },
  ];

  return (
    <div className="flex h-screen bg-[#0d1b2a] text-white">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-[#0a1128] to-[#1b1f3b] p-5 shadow-lg ${isOpen ? "w-64" : "w-20"} transition-all duration-300`}>
        <button onClick={() => setIsOpen(!isOpen)} className="mb-6 focus:outline-none">
          {isOpen ? <X size={28} className="text-gray-300 hover:text-white transition duration-200" /> : <Menu size={28} className="text-gray-300 hover:text-white transition duration-200" />}
        </button>
        <nav className="flex flex-col gap-4">
          <NavItem icon={<Home size={24} className="text-cyan-400" />} text="Dashboard" isOpen={isOpen} />
          <NavItem icon={<Users size={24} className="text-green-400" />} text="Customers" isOpen={isOpen} />
          <NavItem icon={<ClipboardList size={24} className="text-yellow-400" />} text="Quotations" isOpen={isOpen} />
          <NavItem icon={<FileText size={24} className="text-blue-400" />} text="Invoices" isOpen={isOpen} />
          <NavItem icon={<Bell size={24} className="text-red-400" />} text="Notifications" isOpen={isOpen} />
          <NavItem icon={<Settings size={24} className="text-purple-400" />} text="Settings" isOpen={isOpen} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-[#1b263b] text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-300">Manage customers, quotations, and invoices efficiently.</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="col-span-2 bg-[#1a2238] p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white">📊 Quotations Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#bbb" />
                <YAxis stroke="#bbb" />
                <Tooltip wrapperStyle={{ backgroundColor: "#333", color: "#fff" }} />
                <Bar dataKey="quotations" fill="#5a7fc8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics Cards */}
          <Card title="Total Customers" value="1,200" color="bg-gradient-to-r from-green-500 to-green-700" />
          <Card title="Pending Quotations" value="245" color="bg-gradient-to-r from-yellow-500 to-yellow-700" />
          <Card title="Approved Invoices" value="860" color="bg-gradient-to-r from-blue-500 to-blue-700" />
          <Card title="Notifications" value="15 New" color="bg-gradient-to-r from-red-500 to-red-700" />
        </div>
      </div>
    </div>
  );
}

// Sidebar Navigation Item
function NavItem({ icon, text, isOpen }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:text-white">
      {icon}
      {isOpen && <span className="text-gray-200 font-medium">{text}</span>}
    </div>
  );
}

// Dashboard Cards with Unique Colors
function Card({ title, value, color }) {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md flex flex-col justify-center`}>
      <h3 className="text-gray-100 text-lg">{title}</h3>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
