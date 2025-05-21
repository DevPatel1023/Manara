import { useState, useEffect, useCallback } from "react";
import {
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  UserPlus,
  LogOut,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:3000", // Backend on port 3000
});

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({ stats: true, rfqs: true, quotations: true, users: true });
  const [error, setError] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const validateToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      jwtDecode(token);
      return true;
    } catch (err) {
      console.error("Invalid token:", err.message);
      return false;
    }
  }, []);

  const fetchUser = useCallback(async () => {
    if (!validateToken()) {
      setError("No valid token found. Please log in.");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/v1/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.user.role !== "admin") {
        setError("Unauthorized: Admin access required");
        navigate("/login");
        return;
      }
      setUser(res.data.user);
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err.message);
      setError("Failed to authenticate. Please log in again.");
      navigate("/login");
    }
  }, [navigate, validateToken]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const [statsRes, rfqsRes, quotationsRes, usersRes] = await Promise.all([
        api
          .get("/api/v1/stats", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => ({ status: "success", data: res.data }))
          .catch((err) => {
            console.error("Stats error:", err.response?.data || err.message);
            return { status: "error", data: null };
          }),
        api
          .get("/api/v1/RFQS/getAllRFQS", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => ({ status: "success", data: res.data }))
          .catch((err) => {
            console.error("RFQs error:", err.response?.data || err.message);
            return { status: "error", data: { rfqs: [] } };
          }),
        api
          .get("/api/v1/quotations/getall", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => ({ status: "success", data: res.data }))
          .catch((err) => {
            console.error("Quotations error:", err.response?.data || err.message);
            return { status: "error", data: [] };
          }),
        api
          .get(`/api/v1/users/all?page=${userPage}&limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ status: "success", data: res.data }))
          .catch((err) => {
            console.error("Users error:", err.response?.data || err.message);
            return { status: "error", data: { users: [], total: 0 } };
          }),
      ]);

      if (statsRes.status === "success") setStats(statsRes.data);
      else setError((prev) => prev || "Failed to fetch stats");
      setLoading((prev) => ({ ...prev, stats: false }));

      if (rfqsRes.status === "success") {
        // Handle possible nested data structure
        const rfqsData = rfqsRes.data.data?.rfqs || rfqsRes.data.rfqs || [];
        setRfqs(rfqsData);
      } else {
        setError((prev) => prev || "Failed to fetch RFQs");
      }
      setLoading((prev) => ({ ...prev, rfqs: false }));

      if (quotationsRes.status === "success") {
        // Handle possible nested data structure
        const quotationsData = quotationsRes.data.data || quotationsRes.data || [];
        setQuotations(quotationsData);
      } else {
        setError((prev) => prev || "Failed to fetch quotations");
      }
      setLoading((prev) => ({ ...prev, quotations: false }));

      if (usersRes.status === "success") {
        // Handle possible nested data structure
        const usersData = usersRes.data.data?.users || usersRes.data.users || [];
        const totalData = usersRes.data.data?.total || usersRes.data.total || 0;
        setUsers(usersData);
        setTotalUsers(totalData);
      } else {
        setError((prev) => prev || "Failed to fetch users");
      }
      setLoading((prev) => ({ ...prev, users: false }));
    } catch (err) {
      console.error("Fetch data error:", err.message);
      setError("Failed to fetch data. Please try again.");
      setLoading({ stats: false, rfqs: false, quotations: false, users: false });
    }
  }, [user, userPage]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRetry = () => {
    setError(null);
    setLoading({ stats: true, rfqs: true, quotations: true, users: true });
    fetchData();
  };

  const isLoading = Object.values(loading).some((status) => status);

  if (isLoading && !stats && !rfqs.length && !quotations.length && !users.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  const chartData = {
    labels:
      quotations.length > 0
        ? quotations.slice(0, 7).map((q) => new Date(q.createdAt || Date.now()).toLocaleDateString())
        : ["No Data"],
    datasets: [
      {
        label: "Sales",
        data: quotations.length > 0 ? quotations.slice(0, 7).map((q) => q.total || 0) : [0],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome back, {user?.firstName || "Admin"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Here's what's happening with your business today.
            </p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button> */}
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <RefreshCw size={16} className="mr-2" /> Retry
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
          <button
            className={`px-6 py-3 font-semibold text-sm transition-all duration-300 ${
              activeTab === "overview"
                ? "text-emerald-600 dark:text-emerald-400 border-b-4 border-emerald-600 dark:border-emerald-400"
                : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewContent
            stats={stats}
            rfqs={rfqs}
            quotations={quotations}
            users={users}
            chartData={chartData}
            userPage={userPage}
            setUserPage={setUserPage}
            totalUsers={totalUsers}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ stats, rfqs, quotations, users, chartData, userPage, setUserPage, totalUsers, loading }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={loading.stats ? "Loading..." : stats?.totalCustomers || "0"}
          change="+12%"
          isPositive={true}
          icon={<Users size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Active Quotations"
          value={loading.stats ? "Loading..." : stats?.activeQuotations || "0"}
          change="+8%"
          isPositive={true}
          icon={<ClipboardList size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Pending RFQs"
          value={loading.stats ? "Loading..." : stats?.pendingRfqs || "0"}
          change="+15%"
          isPositive={true}
          icon={<FileText size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={loading.stats ? "Loading..." : `₹${stats?.monthlyRevenue.toLocaleString("en-IN") || "0"}`}
          change="+23%"
          isPositive={true}
          icon={<CreditCard size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {loading.rfqs ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading activities...</p>
            ) : rfqs.length === 0 && quotations.length === 0 && users.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activities</p>
            ) : (
              <>
                {rfqs.slice(0, 2).map((rfq) => (
                  <ActivityItem
                    key={rfq._id}
                    title="New RFQ"
                    description={`RFQ from ${rfq.companyName || "Unknown"}`}
                    time={new Date(rfq.createdAt || Date.now()).toLocaleDateString()}
                    icon={<FileText size={16} />}
                    iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  />
                ))}
                {quotations.slice(0, 2).map((quotation) => (
                  <ActivityItem
                    key={quotation._id}
                    title="Quotation Update"
                    description={`Quotation #${quotation.poNumber || "N/A"} marked as ${quotation.status || "Unknown"}`}
                    time={new Date(quotation.createdAt || Date.now()).toLocaleDateString()}
                    icon={<CheckCircle size={16} />}
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  />
                ))}
                {users.slice(0, 1).map((user) => (
                  <ActivityItem
                    key={user._id}
                    title="New Customer"
                    description={`${user.firstName || ""} ${user.lastName || ""} registered as a new customer`}
                    time={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    icon={<UserPlus size={16} />}
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Overview</h3>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 focus:ring-2 focus:ring-emerald-600">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64">
            {loading.quotations ? (
              <div className="h-64 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
              </div>
            ) : quotations.length > 0 ? (
              <Bar data={chartData} options={{ maintainAspectRatio: false }} />
            ) : (
              <div className="h-64 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <BarChart2 size={48} className="mx-auto mb-2 opacity-50" />
                <p>No sales data available</p>
              </div>
            )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading.users ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading customers...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No customers found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                          {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName || ""} {user.lastName || ""}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.companyName || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.companyName || "N/A"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading.users && users.length > 0 && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
              disabled={userPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setUserPage((p) => p + 1)}
              disabled={userPage * 10 >= totalUsers}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {icon}
        </div>
        <div
          className={`flex items-center ${
            isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          } text-sm font-medium`}
        >
          {change}
          <ArrowUpRight size={16} className="ml-1" />
        </div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );
};

const ActivityItem = ({ title, description, time, icon, iconBg }) => {
  return (
    <div className="flex items-start transform hover:translate-x-2 transition-transform duration-200">
      <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mr-3 flex-shrink-0`}>
        {icon}
      </div>
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
  );
};

export default AdminDashboard;