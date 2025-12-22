import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Roster from "./pages/Roster";
import Scheduler from "./pages/Scheduler";
import EmployeePortal from "./pages/EmployeePortal";
import Clients from "./pages/Clients";
import Sites from "./pages/Sites";
import Reports from "./pages/Reports";
import LeaveManagement from "./pages/LeaveManagement";
import SiteActivities from "./pages/SiteActivities";
import TimeAttendance from "./pages/TimeAttendance";
import Packages from "./pages/Packages";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="roster" element={<Roster />} />
          <Route path="attendance/time" element={<TimeAttendance />} />
          <Route path="employees" element={<EmployeePortal />} />
          <Route path="employees/compliance" element={<Reports />} />
          <Route path="employees/leave" element={<LeaveManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="operations/site-activities" element={<SiteActivities />} />
          <Route path="company/sites" element={<Sites />} />
          <Route path="company/clients" element={<Clients />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
