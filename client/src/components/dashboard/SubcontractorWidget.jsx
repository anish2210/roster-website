import { RotateCw, Maximize2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export default function SubcontractorWidget() {
  const columns = [
    "Contractor",
    "Emp & Users",
    "Rostered Hrs",
    "Attendance Hrs",
    "Attendance %",
    "Mobile Attendance %",
    "No Show %",
    "Lateness Rate",
  ];

  const contractors = [
    {
      name: "Internal Team/Staff",
      empUsers: 48,
      rosteredHrs: "0.00 Hrs",
      attendanceHrs: "0.02 Hrs",
      attendancePercent: 100,
      mobileAttendancePercent: 100,
      noShowPercent: 0,
      latenessRate: 0,
    },
  ];

  const CircularProgress = ({ percentage, size = 48 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative inline-flex" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">Subcontractor Dashboard</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-center">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="mx-4 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
          Current Month
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded">
            <span className="text-sm font-medium text-purple-700">47</span>
            <span className="text-sm text-purple-600">Employees</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded">
            <span className="text-sm font-medium text-green-700">1</span>
            <span className="text-sm text-green-600">Admin/Office Users</span>
          </div>
          <Select className="w-20">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {column}
                    {index === 0 && (
                      <button className="hover:bg-gray-200 rounded p-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contractors.map((contractor, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {contractor.name}
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-900 rounded font-medium">
                    {contractor.empUsers}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-50 text-gray-900 rounded">
                    {contractor.rosteredHrs}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-50 text-gray-900 rounded">
                    {contractor.attendanceHrs}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <CircularProgress percentage={contractor.attendancePercent} />
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <CircularProgress percentage={contractor.mobileAttendancePercent} />
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span className="text-gray-900 font-medium">{contractor.noShowPercent}%</span>
                </td>
                <td className="px-4 py-4 text-sm text-center">
                  <span className="text-gray-900 font-medium">{contractor.latenessRate}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
          1
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </Card>
  );
}
