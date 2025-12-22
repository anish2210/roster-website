import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import complianceData from "../../data/complianceData";

export default function ComplianceFilters({ filters, setFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    licenseType: true,
    state: true,
    deptWorkGroup: true,
    expiresWithin: true,
  });

  // Get unique employees from compliance data
  const uniqueEmployees = useMemo(() => {
    const empMap = new Map();
    complianceData.forEach((item) => {
      if (!empMap.has(item.empNo)) {
        empMap.set(item.empNo, {
          empNo: item.empNo,
          name: item.employeeName,
        });
      }
    });
    return Array.from(empMap.values());
  }, []);

  // Get unique values for dropdowns
  const uniqueStatuses = useMemo(
    () => ["All Status", ...new Set(complianceData.map((item) => item.status))],
    []
  );

  const uniqueLicenseTypes = useMemo(
    () => [
      "All License/Cert. Types",
      ...new Set(complianceData.map((item) => item.licenseCert)),
    ],
    []
  );

  const uniqueStates = useMemo(
    () => [
      "All States",
      ...new Set(complianceData.map((item) => item.state).filter(Boolean)),
    ],
    []
  );

  const uniqueDeptWorkGroups = useMemo(
    () => [
      "All Dept/Work Groups",
      ...new Set(complianceData.map((item) => item.deptWorkGroup).filter(Boolean)),
    ],
    []
  );

  const expiresOptions = [
    "Expires Within...",
    "7 days",
    "30 days",
    "60 days",
    "90 days",
    "6 months",
    "1 year",
  ];

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      licenseType: "all",
      state: "all",
      deptWorkGroup: "all",
      expiresWithin: "all",
      selectedEmployees: [],
    });
  };

  const handleSelectAllEmployees = () => {
    setFilters({
      ...filters,
      selectedEmployees: uniqueEmployees.map((emp) => emp.empNo),
    });
  };

  const handleUnselectAllEmployees = () => {
    setFilters({
      ...filters,
      selectedEmployees: [],
    });
  };

  const handleEmployeeToggle = (empNo) => {
    setFilters({
      ...filters,
      selectedEmployees: filters.selectedEmployees.includes(empNo)
        ? filters.selectedEmployees.filter((id) => id !== empNo)
        : [...filters.selectedEmployees, empNo],
    });
  };

  return (
    <div className="p-4">
      {/* Clear Filters Link */}
      <div className="mb-4">
        <button
          onClick={handleClearFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <select
          value={filters.status === "all" ? "All Status" : filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value === "All Status" ? "all" : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* License Type Filter */}
      <div className="mb-4">
        <select
          value={
            filters.licenseType === "all"
              ? "All License/Cert. Types"
              : filters.licenseType
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              licenseType:
                e.target.value === "All License/Cert. Types"
                  ? "all"
                  : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          {uniqueLicenseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* State Filter */}
      <div className="mb-4">
        <select
          value={filters.state === "all" ? "All States" : filters.state}
          onChange={(e) =>
            setFilters({
              ...filters,
              state: e.target.value === "All States" ? "all" : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Dept/Work Group Filter */}
      <div className="mb-4">
        <select
          value={
            filters.deptWorkGroup === "all"
              ? "All Dept/Work Groups"
              : filters.deptWorkGroup
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              deptWorkGroup:
                e.target.value === "All Dept/Work Groups"
                  ? "all"
                  : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          {uniqueDeptWorkGroups.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Expires Within Filter */}
      <div className="mb-4">
        <select
          value={
            filters.expiresWithin === "all"
              ? "Expires Within..."
              : filters.expiresWithin
          }
          onChange={(e) =>
            setFilters({
              ...filters,
              expiresWithin:
                e.target.value === "Expires Within..." ? "all" : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
        >
          {expiresOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Selection */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Employees</h3>
          <div className="flex gap-2 text-xs">
            <button
              onClick={handleSelectAllEmployees}
              className="text-blue-600 hover:text-blue-700"
            >
              Select All
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleUnselectAllEmployees}
              className="text-blue-600 hover:text-blue-700"
            >
              Unselect All
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {uniqueEmployees.map((emp) => (
            <label
              key={emp.empNo}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.selectedEmployees.includes(emp.empNo)}
                onChange={() => handleEmployeeToggle(emp.empNo)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {emp.empNo} - {emp.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
