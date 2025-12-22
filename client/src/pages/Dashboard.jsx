import { FileText, RotateCw } from "lucide-react";
import DashboardStats from "../components/dashboard/DashboardStats";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import CoverageWidget from "../components/dashboard/CoverageWidget";
import LeaveRequestsWidget from "../components/dashboard/LeaveRequestsWidget";
import AvailabilityRequestsWidget from "../components/dashboard/AvailabilityRequestsWidget";
import SubcontractorWidget from "../components/dashboard/SubcontractorWidget";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-900">Live Dashboard</h1>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
          <RotateCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Attendance Chart */}
        <AttendanceChart />

        {/* Coverage Widgets */}
        <CoverageWidget />

        {/* Leave and Availability Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LeaveRequestsWidget />
          <AvailabilityRequestsWidget />
        </div>

        {/* Subcontractor Dashboard */}
        <SubcontractorWidget />
      </div>
    </div>
  );
}
