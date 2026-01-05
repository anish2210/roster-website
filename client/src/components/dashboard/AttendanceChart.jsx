import { useState } from "react";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, RotateCw, Settings2 } from "lucide-react";

export default function AttendanceChart() {
  const [viewMode, setViewMode] = useState("shift");
  const [date, setDate] = useState("Today");
  const [chartType, setChartType] = useState("bar");
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const attendanceData = [
    { label: "Working", value: 0, color: "bg-blue-500" },
    { label: "No Show", value: 0, color: "bg-red-500" },
    { label: "No Activity", value: 0, color: "bg-gray-400" },
    { label: "Late Arrival", value: 0, color: "bg-orange-400" },
    { label: "Early Leave", value: 0, color: "bg-yellow-400" },
    { label: "Left Job Site", value: 0, color: "bg-purple-400" },
    { label: "Clocked Outside Job Site", value: 0, color: "bg-pink-400" },
    { label: "Missing Clock-Out", value: 0, color: "bg-indigo-400" },
  ];

  const summaryStats = [
    { label: "Working", value: 0 },
    { label: "No Show", value: 0 },
    { label: "No Activity", value: 0 },
    { label: "Late Arrival", value: 0 },
    { label: "Early Leave", value: 0 },
    { label: "Left Job Site", value: 0 },
    { label: "Clocked Outside Job Site", value: 0 },
    { label: "Missing Clock-Out", value: 0 },
    { label: "Total Scheduled Shifts", value: 0 },
    { label: "Total Worked Shifts", value: 0 },
  ];

  const liveAttendanceColumns = [
    "Date",
    "Employee",
    "Mobile",
    "Site",
    "Shift Time",
    "HRS",
    "In",
    "Out",
    "Break",
    "Total HRS",
    "Notes",
    "HRS Diff",
    "Clocking Status",
  ];

  // Live Attendance Table View
  const renderLiveAttendance = () => (
    <Card className="p-0">
      {/* Date Selector */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="mx-4 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
            {date}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center gap-1 text-sm text-gray-700">
            <Settings2 className="w-4 h-4" />
            Columns
          </button>
          <Select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="w-20"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200" colSpan="4">
                <div className="flex items-center gap-1">
                  <button className="hover:bg-gray-200 rounded p-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200" colSpan="2">
                Shift Assignments
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200" colSpan="4">
                Clocked Record
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider" colSpan="3"></th>
            </tr>
            <tr className="bg-gray-100">
              {liveAttendanceColumns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {column}
                    <button className="hover:bg-gray-200 rounded p-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={liveAttendanceColumns.length} className="px-4 py-12 text-center text-sm text-gray-500">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-600 italic">
          Showing 0 to 0 of 0 entries
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );

  // Chart View
  const renderChartView = () => (
    <div className="flex gap-4">
      {/* Chart Section */}
      <Card className="flex-1 p-4">
        {/* Date Selector */}
        <div className="flex items-center justify-center mb-6">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="mx-4 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
            {date}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bar Chart */}
        <div className="h-64 flex items-end justify-around gap-2 mb-4">
          {attendanceData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full bg-gray-100 rounded-t relative" style={{ height: "200px" }}>
                <div
                  className={`${item.color} rounded-t absolute bottom-0 w-full transition-all`}
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center w-full px-1 truncate" title={item.label}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Circles */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-6 items-start">
          {attendanceData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-gray-900">{item.value}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center w-full px-1 truncate h-4" title={item.label}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats Sidebar */}
      <Card className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">Today</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-32 text-sm"
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </Select>
        </div>

        <div className="space-y-2">
          {summaryStats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-2 px-3 rounded ${
                index >= summaryStats.length - 2
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="text-sm text-gray-700">{stat.label}</span>
              <span className="text-sm font-medium text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={() => setViewMode("shift")}
          className={`px-4 py-2 text-sm rounded border ${
            viewMode === "shift"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Attendance By Shift
        </button>
        <button
          onClick={() => setViewMode("live")}
          className={`px-4 py-2 text-sm rounded border ${
            viewMode === "live"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Live Attendance
        </button>
      </div>

      {/* Conditional Rendering */}
      {viewMode === "live" ? renderLiveAttendance() : renderChartView()}
    </div>
  );
}
