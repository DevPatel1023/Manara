import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import Quotation from "./pages/Quotation";
import QuotationForm from "./components/QuotationForm";
import Customers from "./pages/Customers";
import { ThemeProvider } from "./hooks/ThemeContext";
import Invoice from "./pages/Invoice";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import RFQ from "./pages/RFQ";
import POForm from "./components/POForm";
import RoleRedirectDashboard from "./pages/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import DashboardLayout from "./components/DashboardLayout";
import AdminQuotationTable from "./components/AdminQuotationTable";
import POAdminView from "./components/PoAdminView";
import InvoicesPage from "./components/InvoicesPage";

// ✅ Utility to extract role from token
const getUserRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(base64Payload));
    return decodedPayload.role || null;
  } catch (err) {
    console.error("Error decoding token", err);
    return null;
  }
};

function App() {
  const userRole = getUserRoleFromToken(); // 🔥 get dynamic role

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#ffffff] text-[#1e2022] dark:bg-[#25282a] dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<RoleRedirectDashboard />} />

            {/* Role-based dashboards */}
            <Route path="/dashboard/admin" element={<DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>} />
            <Route path="/dashboard/employee" element={<DashboardLayout role="employee"><EmployeeDashboard /></DashboardLayout>} />
            <Route path="/dashboard/client" element={<DashboardLayout role="client"><ClientDashboard /></DashboardLayout>} />

            {/* Role-based features */}
            <Route path="/dashboard/client/quotations" element={<DashboardLayout role="client"><Quotation /></DashboardLayout>} />
            <Route path="/dashboard/employee/quotationform" element={<DashboardLayout role="employee"><QuotationForm /></DashboardLayout>} />
            <Route path="/dashboard/admin/quotations" element={<DashboardLayout role="admin"><AdminQuotationTable /></DashboardLayout>} />

            {/* ✅ Dynamic RFQ routes */}
            <Route path="/dashboard/admin/rfq" element={<RFQ role={userRole} />} />
            <Route path="/dashboard/client/rfq" element={<RFQ role={userRole} />} />
            <Route path="/dashboard/employee/rfq" element={<RFQ role={userRole} />} />

            <Route path="/dashboard/client/po" element={<DashboardLayout role="client"><POForm /></DashboardLayout>} />
            <Route path="/dashboard/admin/po" element={<DashboardLayout role="admin"><POAdminView /></DashboardLayout>} />
            <Route path="/dashboard/client/profile" element={<UserProfile />} />
            <Route path="/dashboard/admin/profile" element={<UserProfile />} />
            <Route path="/dashboard/employee/profile" element={<UserProfile />} />

            {/* Shared pages */}
            <Route path="/customers" element={<Customers />} />
            <Route path="/dashboard/client/invoices" element={<DashboardLayout role="client"><InvoicesPage /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
