import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  ClipboardList,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";
import axios from "axios";
import { getUserFromToken } from "../services/GetUserFromToken";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust if backend URL differs
});

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState({ rfqs: true, quotations: true, invoices: true, pos: true });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(() => {
    const userData = getUserFromToken();
    if (!userData || userData.role !== "client") {
      setError("Unauthorized or no valid token. Please log in as a client.");
      navigate("/login");
      return;
    }
    setUser(userData);
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const [rfqsRes, quotationsRes, invoicesRes, posRes] = await Promise.all([
        api
          .get("/v1/RFQS/myRfqs", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("RFQs response:", res.data);
            return { status: "success", data: res.data };
          })
          .catch((err) => {
            console.error("RFQs error:", err.response?.data || err.message);
            return { status: "error", data: { rfqs: [] } };
          }),
        api
          .get("/v1/quotations/client", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("Quotations response:", res.data);
            return { status: "success", data: res.data };
          })
          .catch((err) => {
            console.error("Quotations error:", err.response?.data || err.message);
            return { status: "error", data: [] };
          }),
        api
          .get("/v1/po/client", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("Invoices response:", res.data);
            return { status: "success", data: res.data };
          })
          .catch((err) => {
            console.error("Invoices error:", err.response?.data || err.message);
            return { status: "error", data: { invoices: [], total: 0 } };
          }),
        api
          .get("/v1/po/client", { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log("POs response:", res.data);
            return { status: "success", data: res.data };
          })
          .catch((err) => {
            console.error("POs error:", err.response?.data || err.message);
            return { status: "error", data: { pos: [], total: 0 } };
          }),
      ]);

      if (rfqsRes.status === "success") {
        const rfqsData = rfqsRes.data.rfqs || rfqsRes.data.data?.rfqs || [];
        setRfqs(rfqsData);
      } else {
        setError((prev) => prev || "Failed to fetch RFQs");
      }
      setLoading((prev) => ({ ...prev, rfqs: false }));

      if (quotationsRes.status === "success") {
        const quotationsData = Array.isArray(quotationsRes.data) ? quotationsRes.data : quotationsRes.data.data || [];
        setQuotations(quotationsData);
      } else {
        setError((prev) => prev || "Failed to fetch quotations");
      }
      setLoading((prev) => ({ ...prev, quotations: false }));

      if (invoicesRes.status === "success") {
        const invoicesData = invoicesRes.data.invoices || invoicesRes.data.data?.invoices || invoicesRes.data.pos || [];
        setInvoices(invoicesData);
      } else {
        setError((prev) => prev || `Failed to fetch invoices: ${invoicesRes.data?.message || "Unknown error"}`);
      }
      setLoading((prev) => ({ ...prev, invoices: false }));

      if (posRes.status === "success") {
        const posData = posRes.data.pos || posRes.data.data?.pos || [];
        setPos(posData);
      } else {
        setError((prev) => prev || "Failed to fetch POs");
      }
      setLoading((prev) => ({ ...prev, pos: false }));
    } catch (err) {
      console.error("Fetch data error:", err.message);
      setError("Failed to fetch data. Please try again.");
      setLoading({ rfqs: false, quotations: false, invoices: false, pos: false });
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    setError(null);
    setLoading({ rfqs: true, quotations: true, invoices: true, pos: true });
    fetchData();
  };

  const isLoading = Object.values(loading).some((status) => status);

  if (isLoading && !rfqs.length && !quotations.length && !invoices.length && !pos.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back, {user?.name || "Client"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Here's what's happening with your account.</p>
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

        {activeTab === "overview" && (
          <OverviewContent rfqs={rfqs} quotations={quotations} invoices={invoices} pos={pos} loading={loading} />
        )}
      </div>
    </div>
  );
};

const OverviewContent = ({ rfqs, quotations, invoices, pos, loading }) => {
  const StatCard = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transform hover:scale-105 transition-all duration-300">
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
  );

  const ActivityItem = ({ title, description, time, icon, iconBg }) => (
    <div className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${iconBg}`}>{icon}</div>
      <div>
        <h4 className="text-sm font-medium text-gray-800 black:text-white">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">{time}</div>
    </div>
  );

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
  );

  const POItem = ({ poNumber, amount, date }) => (
    <div className="flex items-center">
      <div>
        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{poNumber}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
      </div>
      <div className="ml-auto">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{amount}</p>
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
          Approved
        </span>
      </div>
    </div>
  );

  const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getRecentActivities = () => {
    const activities = [];
    rfqs.slice(0, 2).forEach((rfq) => {
      activities.push({
        title: "RFQ Submitted",
        description: `Your RFQ #${rfq.rfqNumber || rfq._id} was submitted`,
        time: new Date(rfq.createdAt || Date.now()).toLocaleDateString(),
        icon: <ClipboardList size={16} />,
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      });
    });
    quotations.slice(0, 2).forEach((quotation) => {
      activities.push({
        title: "Quotation Update",
        description: `Quotation #${quotation.poNumber || quotation._id} marked as ${quotation.status}`,
        time: new Date(quotation.createdAt || Date.now()).toLocaleDateString(),
        icon: <CheckCircle size={16} />,
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      });
    });
    invoices.slice(0, 2).forEach((invoice) => {
      activities.push({
        title: invoice.status === "overdue" ? "Payment Due" : "New Invoice",
        description: `Invoice #${invoice.invoiceNumber || invoice.poNumber || invoice._id} is ${invoice.status}`,
        time: new Date(invoice.createdAt || Date.now()).toLocaleDateString(),
        icon: invoice.status === "overdue" ? <AlertCircle size={16} /> : <FileText size={16} />,
        iconBg:
          invoice.status === "overdue"
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      });
    });
    pos.slice(0, 2).forEach((po) => {
      activities.push({
        title: "PO Approved",
        description: `Purchase Order #${po.poNumber || po._id} was approved`,
        time: new Date(po.createdAt || Date.now()).toLocaleDateString(),
        icon: <Package size={16} />,
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      });
    });
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 4);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Quotations"
          value={loading.quotations ? "Loading..." : quotations.filter((q) => q.status === "pending").length}
          change={loading.quotations ? "..." : `+${Math.min(quotations.length, 2)}`}
          isPositive={true}
          icon={<ClipboardList size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Pending RFQs"
          value={loading.rfqs ? "Loading..." : rfqs.filter((r) => r.status === "pending").length}
          change={loading.rfqs ? "..." : `+${Math.min(rfqs.length, 1)}`}
          isPositive={true}
          icon={<FileText size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Open Invoices"
          value={loading.invoices ? "Loading..." : invoices.filter((i) => i.status !== "paid").length}
          change={loading.invoices ? "..." : `-${Math.min(invoices.length, 2)}`}
          isPositive={false}
          icon={<CreditCard size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Approved POs"
          value={loading.pos ? "Loading..." : pos.length}
          change={loading.pos ? "..." : `+${Math.min(pos.length, 2)}`}
          isPositive={true}
          icon={<Package size={24} className="text-emerald-600 dark:text-emerald-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {loading.rfqs || loading.quotations || loading.invoices || loading.pos ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading activities...</p>
            ) : getRecentActivities().length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activities</p>
            ) : (
              getRecentActivities().map((activity, index) => (
                <ActivityItem
                  key={index}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  icon={activity.icon}
                  iconBg={activity.iconBg}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Quotations</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {loading.quotations ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading quotations...</p>
            ) : quotations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No recent quotations</p>
            ) : (
              quotations.slice(0, 3).map((quotation) => (
                <QuotationItem
                  key={quotation._id}
                  quotationNumber={quotation.poNumber || quotation._id}
                  amount={formatINR(quotation.total || 0)}
                  date={new Date(quotation.createdAt || Date.now()).toLocaleDateString()}
                  status={quotation.status || "pending"}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Purchase Orders</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {loading.pos ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading POs...</p>
            ) : pos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No approved Purchase Orders found.</p>
            ) : (
              pos.slice(0, 3).map((po) => (
                <POItem
                  key={po._id}
                  poNumber={po.poNumber || po._id}
                  amount={formatINR(po.total || 0)}
                  date={new Date(po.createdAt || Date.now()).toLocaleDateString()}
                />
              ))
            )}
          </div>
        </div>
      </div>

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
                  Invoice Name
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
              {loading.invoices ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No invoices found. Invoices are created from approved Purchase Orders.
                  </td>
                </tr>
              ) : (
                invoices.slice(0, 3).map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber || invoice.poNumber || invoice._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {invoice.billTo.company || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatINR(invoice.total || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          invoice.status === "overdue"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                            : invoice.status === "pending"
                            ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {invoice.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 mr-3">
                        View
                      </button>
                      {/* {invoice.status !== "paid" && (
                        <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-md">
                          Pay Now
                        </button>
                      )} */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;