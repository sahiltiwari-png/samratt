import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import LeavePolicy from "./pages/LeavePolicy";
import LeaveRequests from "./pages/LeaveRequests";
import Employees from "./pages/Employees";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import AddEmployeeStepper from "./pages/AddEmployeeStepper";
import HR from "./pages/HR";
import Payroll from "./pages/Payroll";
import SalarySlips from "./pages/SalarySlips";  
import Reports from "./pages/Reports";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationDetails from "./pages/OrganizationDetails";
import EmployeeAttendanceDetail from "./pages/EmployeeAttendanceDetail";

// Layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/add-employee" element={<AddEmployeeStepper />} />
                      <Route path="/hr" element={<HR />} />
                      <Route path="/hr/:id" element={<HR />} />
                      <Route path="/organizations/:id" element={<OrganizationDetails />} />
                      <Route path="/payroll" element={<Payroll />} />
                      <Route path="/salary-slips" element={<SalarySlips />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/attendance/employee/:id" element={<EmployeeAttendanceDetail />} />
                      <Route path="/leaves" element={<Leaves />} />
                      <Route path="/leaves/policy" element={<LeavePolicy />} />
                      <Route path="/leaves/requests" element={<LeaveRequests />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/create-organization" element={<CreateOrganization />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;