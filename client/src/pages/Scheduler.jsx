import { useState, useMemo, useEffect, useRef } from "react";
import {
  User,
  MapPin,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCw,
  Upload,
  Printer,
  Search,
  Clock,
  Phone,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  CloudDrizzle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { schedulerApi, weatherApi } from "../lib/api";

export default function Scheduler() {
  const [selectedSite, setSelectedSite] = useState("");
  const [viewMode, setViewMode] = useState("4weeks");
  const [viewType, setViewType] = useState("employee"); // employee, location, position
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef(null);

  // API state
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);

  // Fetch sites on mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await schedulerApi.getSites();
        setSites(response.data.data);
      } catch (err) {
        toast.error('Failed to load sites');
      }
    };
    fetchSites();
  }, []);

  // Fetch employees when site is selected
  useEffect(() => {
    if (!selectedSite) {
      setEmployees([]);
      setWeatherData([]);
      return;
    }

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await schedulerApi.getSiteEmployees(selectedSite);
        setEmployees(response.data.data);
      } catch (err) {
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [selectedSite]);

  // Fetch weather when site is selected
  useEffect(() => {
    if (!selectedSite) {
      setWeatherData([]);
      return;
    }

    const fetchWeather = async () => {
      try {
        // Find the selected site to get coordinates
        const site = sites.find(s => s.id === parseInt(selectedSite));
        if (!site || !site.latitude || !site.longitude) {
          return;
        }

        const response = await weatherApi.getForecast(site.latitude, site.longitude);
        setWeatherData(response.data.data.forecast || []);
      } catch (err) {
        console.error('Failed to load weather data:', err);
        // Don't show error toast for weather - it's not critical
      }
    };

    fetchWeather();
  }, [selectedSite, sites]);

  // Close options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate date columns and range based on view mode
  const { dateColumns, dateRange } = useMemo(() => {
    const today = new Date(2025, 11, 22); // Dec 22, 2025
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let numDays = 0;
    let rangeText = "";

    if (viewMode === "week") {
      numDays = 7;
      rangeText = "Current Week";
    } else if (viewMode === "2weeks") {
      numDays = 14;
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 13);
      rangeText = `22 Dec 25 - ${endDate.getDate()} ${months[endDate.getMonth()]} ${endDate.getFullYear().toString().slice(2)}`;
    } else if (viewMode === "3weeks") {
      numDays = 21;
      rangeText = "22 Dec 25 - 11 Jan 26";
    } else { // 4weeks
      numDays = 28;
      rangeText = "22 Dec 25 - 18 Jan 26";
    }

    const columns = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = months[date.getMonth()];

      if (i === 0) {
        columns.push(`TODAY`);
      } else {
        columns.push(`${dayName} ${dayNum}, ${monthName}`);
      }
    }

    return { dateColumns: columns, dateRange: rangeText };
  }, [viewMode]);

  const stats = [
    { label: "Coverage Hrs", value: "0.00", color: "bg-green-500" },
    { label: "Confirmed Hrs", value: "0.00", color: "bg-green-500" },
    { label: "Tentative Hrs", value: "0.00", color: "bg-red-500" },
    { label: "Published Shifts", value: "0", color: "bg-green-500" },
    { label: "Unpublished Shifts", value: "0", color: "bg-yellow-500" },
    { label: "Open Shifts", value: "0", color: "bg-red-500" },
    { label: "Warnings", value: "0", color: "bg-orange-500" },
  ];

  // Get view mode label for select
  const getViewModeLabel = () => {
    if (viewMode === "week") return "Week";
    if (viewMode === "2weeks") return "2 Weeks";
    if (viewMode === "3weeks") return "3 Weeks";
    return "4 Weeks";
  };

  // Get weather icon based on weather condition
  const getWeatherIcon = (weather) => {
    if (!weather) return null;
    const condition = weather.toLowerCase();
    if (condition.includes('rain')) return <CloudRain className="h-4 w-4" />;
    if (condition.includes('cloud')) return <Cloud className="h-4 w-4" />;
    if (condition.includes('snow')) return <CloudSnow className="h-4 w-4" />;
    if (condition.includes('drizzle')) return <CloudDrizzle className="h-4 w-4" />;
    if (condition.includes('clear') || condition.includes('sun')) return <Sun className="h-4 w-4" />;
    return <Cloud className="h-4 w-4" />;
  };

  // Get weather for a specific date
  const getWeatherForDate = (dateIndex) => {
    if (!weatherData || weatherData.length === 0) return null;

    // Calculate the actual date for this column
    const today = new Date(2025, 11, 22);
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + dateIndex);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    // Find weather data for this date
    return weatherData.find(w => w.date === targetDateStr);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="w-48"
          >
            <option value="">Select Site...</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.shortName} - {site.siteLocationName}
              </option>
            ))}
          </Select>

          <Button
            variant={viewType === "employee" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("employee")}
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "location" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("location")}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === "position" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewType("position")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md min-w-[160px] justify-center">
            <span className="text-sm font-medium">{dateRange}</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="w-32"
          >
            <option value="week">Week</option>
            <option value="2weeks">2 Weeks</option>
            <option value="3weeks">3 Weeks</option>
            <option value="4weeks">4 Weeks</option>
          </Select>

          <Button variant="outline" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>

          <div className="relative" ref={optionsRef}>
            <Button
              variant="outline"
              onClick={() => setOptionsOpen(!optionsOpen)}
            >
              Options <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            {/* Options Dropdown */}
            {optionsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4 text-blue-600" />
                    Bulk Create OPEN Shifts
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Copy Roster to Attendance
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4 text-blue-600" />
                    Shift View
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4 text-blue-600" />
                    View Deleted Shifts
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>

                  <div className="px-4 py-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm">Show Total Hours</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                  <div className="px-4 py-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm">Show Scheduled Employees Only</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                  <div className="px-4 py-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm">Minimized View</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button variant="success">
            No Shifts Published
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[185px] border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Location View - Show only "TODAY" label */}
            {viewType === "location" && (
              <div className="p-3 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-700">TODAY</div>
              </div>
            )}

            {/* Employee View - Show Open Shift and Employee List */}
            {viewType === "employee" && (
              <>
                {/* Open Shift */}
                <div className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-10 h-10 rounded bg-white border border-gray-300 flex items-center justify-center flex-shrink-0">
                      <Grid3x3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">Open Shift</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>0.00 Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee List */}
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {employee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate hover:underline">
                          {employee.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{employee.hours} Hrs</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Position View - Show Open Shift and Employee List */}
            {viewType === "position" && (
              <>
                {/* Open Shift */}
                <div className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-10 h-10 rounded bg-white border border-gray-300 flex items-center justify-center flex-shrink-0">
                      <Grid3x3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">Open Shift</p>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>0.00 Hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee List */}
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {employee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate hover:underline">
                          {employee.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{employee.hours} Hrs</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            {/* Date Headers */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              {dateColumns.map((date, index) => {
                const weather = getWeatherForDate(index);
                return (
                  <div
                    key={index}
                    className="w-[140px] px-2 py-3 text-center border-r border-gray-200"
                  >
                    {date === "TODAY" ? (
                      <div className="text-sm font-bold text-gray-900">TODAY</div>
                    ) : (
                      <>
                        <div className="text-xs font-medium text-gray-700">
                          {date.split(", ")[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {date.split(", ")[1]}
                        </div>
                      </>
                    )}

                    {/* Weather Information */}
                    {weather && (
                      <div className="mt-1 flex items-center justify-center gap-1 text-gray-600">
                        {getWeatherIcon(weather.weather)}
                        <span className="text-xs font-medium">
                          {Math.round(weather.temp)}°C
                        </span>
                      </div>
                    )}

                    {/* Special day labels */}
                    {date.includes("25, Dec") && (
                      <div className="mt-1 px-2 py-0.5 bg-blue-900 text-white text-xs rounded">
                        Christmas Day
                      </div>
                    )}
                    {date.includes("26, Dec") && (
                      <div className="mt-1 px-2 py-0.5 bg-blue-900 text-white text-xs rounded">
                        Boxing Day
                      </div>
                    )}
                    {date.includes("1, Jan") && (
                      <div className="mt-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                        New Year
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Location View - Only show Open Shift row */}
            {viewType === "location" && (
              <div className="flex border-b border-gray-200 h-[73px]">
                {dateColumns.map((_, index) => (
                  <div
                    key={index}
                    className="w-[140px] border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                  />
                ))}
              </div>
            )}

            {/* Employee/Position View - Show Open Shift + Employee Rows */}
            {(viewType === "employee" || viewType === "position") && (
              <>
                {/* Open Shift Row */}
                <div className="flex border-b border-gray-200 h-[73px]">
                  {dateColumns.map((_, index) => (
                    <div
                      key={index}
                      className="w-[140px] border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                    />
                  ))}
                </div>

                {/* Employee Rows */}
                {employees.map((employee) => (
                  <div key={employee.id} className="flex border-b border-gray-200 h-[73px]">
                    {dateColumns.map((_, index) => (
                      <div
                        key={index}
                        className="w-[140px] border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                      />
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-6 text-xs">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-gray-700">
                {stat.value} {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
