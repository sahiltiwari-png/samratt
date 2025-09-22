import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Employees from "./pages/Employees";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import HR from "./pages/HR";
import Payroll from "./pages/Payroll";
import SalarySlips from "./pages/SalarySlips";
import Reports from "./pages/Reports";
import CreateOrganization from "./pages/CreateOrganization";

// Layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <SidebarProvider>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/hr" element={<HR />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/salary-slips" element={<SalarySlips />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leaves" element={<Leaves />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/create-organization" element={<CreateOrganization />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </SidebarProvider>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;