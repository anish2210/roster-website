import { Clock, RotateCw, Maximize2, ChevronLeft, ChevronRight, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export default function AvailabilityRequestsWidget() {
  const stats = [
    { label: "Pending", value: 0, icon: AlertCircle, color: "text-yellow-600" },
    { label: "Approved", value: 0, icon: CheckCircle, color: "text-green-600" },
    { label: "Declined", value: 0, icon: XCircle, color: "text-red-600" },
  ];

  const columns = [
    "Employee",
    "Date Submitted",
    "Notes",
    "Effective From",
    "Status",
    "Assigned To",
    "Actioned By",
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Availability Requests</h3>
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
          Current Week
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <Icon className={`w-4 h-4 ${stat.color} absolute -top-1 -right-1`} />
                </div>
              </div>
              <div className="text-sm text-gray-700">{stat.label}</div>
            </div>
          );
        })}
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
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-500">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </Card>
  );
}
