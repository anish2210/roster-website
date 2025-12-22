import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

export default function LeaveFilters({ filters, setFilters }) {
  const handleClearFilters = () => {
    setFilters({
      leavePeriod: "current_prev_month",
      leaveCategory: "all",
      employee: "all",
    });
  };

  return (
    <div className="bg-gray-50 p-4 space-y-4">
      {/* Clear Filters Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
        <X className="w-4 h-4 text-blue-600" />
      </div>

      {/* Select Leave Period */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Select Leave Period
        </label>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <Select
            value={filters.leavePeriod}
            onChange={(e) =>
              setFilters({ ...filters, leavePeriod: e.target.value })
            }
            className="flex-1"
          >
            <option value="current_prev_month">Current & Prev Month</option>
            <option value="current_month">Current Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="last_6_months">Last 6 Months</option>
            <option value="this_year">This Year</option>
          </Select>
          <button className="p-1 hover:bg-gray-200 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* All Leave Categories */}
      <div className="space-y-2">
        <Select
          value={filters.leaveCategory}
          onChange={(e) =>
            setFilters({ ...filters, leaveCategory: e.target.value })
          }
        >
          <option value="all">All Leave Categories</option>
          <option value="annual">Annual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
          <option value="unpaid">Unpaid Leave</option>
        </Select>
      </div>

      {/* All Employees */}
      <div className="space-y-2">
        <Select
          value={filters.employee}
          onChange={(e) =>
            setFilters({ ...filters, employee: e.target.value })
          }
        >
          <option value="all">All Employees</option>
          <option value="active">Active Employees</option>
          <option value="inactive">Inactive Employees</option>
        </Select>
      </div>

      {/* Search Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        variant="default"
      >
        Search
      </Button>
    </div>
  );
}
