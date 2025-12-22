import { useState } from "react";
import { FileText, Settings, Maximize, RotateCw } from "lucide-react";
import ComplianceFilters from "../components/reports/ComplianceFilters";
import ComplianceTable from "../components/reports/ComplianceTable";

export default function Reports() {
  const [filters, setFilters] = useState({
    status: "all",
    licenseType: "all",
    state: "all",
    deptWorkGroup: "all",
    expiresWithin: "all",
    selectedEmployees: [],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reports Submenu Bar */}
      <div className="bg-teal-600 text-white px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h1 className="text-base sm:text-lg font-semibold">Compliance</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-1.5 sm:p-2 hover:bg-teal-700 rounded transition-colors" title="Settings">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-teal-700 rounded transition-colors" title="Expand">
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-teal-700 rounded transition-colors" title="Refresh">
              <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <ComplianceFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Right Content - Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <ComplianceTable filters={filters} />
        </div>
      </div>
    </div>
  );
}
