import { User, MapPin, LayoutGrid, ChevronLeft, ChevronRight, ChevronDown, Settings, RotateCcw, Printer } from "lucide-react";

export default function SchedulerHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Site Selector */}
          <div className="relative min-w-[200px]">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Site...</option>
              <option>Elimbah Stabling Yard</option>
              <option>Woombay Stabling Yard</option>
              <option>Mayne Stabling Yard</option>
            </select>
          </div>

          {/* Icon Buttons */}
          <div className="flex items-center gap-1">
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="User View">
              <User className="w-4 h-4 text-blue-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Location">
              <MapPin className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Grid View">
              <LayoutGrid className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Center Section - Date Range */}
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap">
            1 - 28 Dec 2025
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            4 Weeks
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Refresh">
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors" title="Print">
            <Printer className="w-4 h-4 text-gray-600" />
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            Options
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap">
            No Shifts Published
          </button>
        </div>
      </div>
    </div>
  );
}
