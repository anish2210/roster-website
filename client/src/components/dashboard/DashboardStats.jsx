import { Calendar, Users, FileText, AlertTriangle, UserX, Plane, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardStats({ date = "Today" }) {
  const stats = [
    {
      label: "Tentative Shifts",
      value: "00",
      icon: Calendar,
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      label: "Open Shifts",
      value: "00",
      icon: Users,
      color: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      label: "Unpublished Shifts",
      value: "00",
      icon: FileText,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Licenses Expiry",
      value: "02",
      icon: AlertTriangle,
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      label: "No Show/Absent",
      value: "00",
      icon: UserX,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      label: "Leave Requests",
      value: "00",
      icon: Plane,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Availability Requests",
      value: "00",
      icon: Clock,
      color: "bg-teal-100",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Date Selector */}
      <div className="flex items-center justify-center py-3 border-b border-gray-200">
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="mx-4 min-w-[120px] text-center">
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1">
            {date}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
