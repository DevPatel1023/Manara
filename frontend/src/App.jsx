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
import RoleRedirectDashboard from "./pages/Dashboard"; // This file will handle redirect based on role
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import DashboardLayout from "./components/DashboardLayout";

function App() {
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
            <Route path="/dashboard/client/quotations" element={<Quotation />} />
            <Route path="/dashboard/client/quotations/form" element={<QuotationForm />} />
            <Route path="/dashboard/client/rfq" element={<RFQ />} />
            <Route path="/dashboard/client/profile" element={<UserProfile />} />
            <Route path="/dashboard/admin/profile" element={<UserProfile />} />
            <Route path="/dashboard/employee/profile" element={<UserProfile />} />

            {/* Shared pages */}
            <Route path="/po" element={<POForm />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
