import { Calendar, Users, FileText, AlertTriangle, UserX, Plane, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export default function DashboardStats({ date = "Today" }) {
  const stats = [
    {
      label: "Tentative Shifts",
      value: "00",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      label: "Open Shifts",
      value: "00",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    {
      label: "Unpublished Shifts",
      value: "00",
      icon: FileText,
      gradient: "from-cyan-500 to-teal-500",
      bgGradient: "bg-gradient-to-br from-cyan-50 to-teal-50",
    },
    {
      label: "Licenses Expiry",
      value: "02",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "bg-gradient-to-br from-orange-50 to-red-50",
    },
    {
      label: "No Show/Absent",
      value: "00",
      icon: UserX,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "bg-gradient-to-br from-pink-50 to-rose-50",
    },
    {
      label: "Leave Requests",
      value: "00",
      icon: Plane,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "bg-gradient-to-br from-emerald-50 to-green-50",
    },
    {
      label: "Availability Requests",
      value: "00",
      icon: Clock,
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "bg-gradient-to-br from-indigo-50 to-blue-50",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Date Selector */}
      <div className="flex items-center justify-center py-4">
        <button className="p-2 hover:bg-white/80 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
        <div className="mx-3 sm:mx-6 min-w-[100px] sm:min-w-[140px] text-center">
          <button className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-1 sm:gap-2 transition-colors hover:bg-white/80 rounded-lg">
            {date}
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className="p-2 hover:bg-white/80 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 shadow-sm hover:-translate-y-1"
            >
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className={`${stat.bgGradient} p-2 sm:p-3 rounded-lg sm:rounded-xl self-start shadow-sm`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-gray-500 mt-1 sm:mt-1.5 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
