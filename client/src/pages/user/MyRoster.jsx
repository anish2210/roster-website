import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCw,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { userApi } from "../../lib/api";

export default function MyRoster() {
  const [viewMode, setViewMode] = useState("week");
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate date columns based on view mode
  const { dateColumns, dateRange } = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let numDays = viewMode === "week" ? 7 : viewMode === "2weeks" ? 14 : viewMode === "3weeks" ? 21 : 28;

    const endDate = new Date(currentStartDate);
    endDate.setDate(endDate.getDate() + numDays - 1);

    const startDay = currentStartDate.getDate();
    const startMonth = months[currentStartDate.getMonth()];
    const startYear = currentStartDate.getFullYear().toString().slice(2);
    const endDay = endDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endYear = endDate.getFullYear().toString().slice(2);

    const rangeText = `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;

    const columns = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < numDays; i++) {
      const date = new Date(currentStartDate);
      date.setDate(date.getDate() + i);
      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = months[date.getMonth()];
      const isToday = date.getTime() === today.getTime();

      columns.push({
        label: isToday ? "TODAY" : `${dayName} ${dayNum}, ${monthName}`,
        date: date,
        isToday,
        dayName,
        dayNum,
        monthName
      });
    }

    return { dateColumns: columns, dateRange: rangeText };
  }, [viewMode, currentStartDate]);

  // Fetch employee's shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const numDays = viewMode === "week" ? 7 : viewMode === "2weeks" ? 14 : viewMode === "3weeks" ? 21 : 28;
        const endDate = new Date(currentStartDate);
        endDate.setDate(endDate.getDate() + numDays - 1);

        const response = await userApi.getMyShifts(
          currentStartDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        setShifts(response.data.data || []);
      } catch (err) {
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [currentStartDate, viewMode]);

  // Navigation functions
  const handlePreviousPeriod = () => {
    const numDays = viewMode === "week" ? 7 : viewMode === "2weeks" ? 14 : viewMode === "3weeks" ? 21 : 28;
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() - numDays);
    setCurrentStartDate(newDate);
  };

  const handleNextPeriod = () => {
    const numDays = viewMode === "week" ? 7 : viewMode === "2weeks" ? 14 : viewMode === "3weeks" ? 21 : 28;
    const newDate = new Date(currentStartDate);
    newDate.setDate(newDate.getDate() + numDays);
    setCurrentStartDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    setCurrentStartDate(monday);
  };

  // Get shifts for a specific date
  const getShiftsForDate = (date) => {
    const targetDateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date).toISOString().split('T')[0];
      return shiftDate === targetDateStr;
    });
  };

  // Format time from ISO string
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Calculate shift duration
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  // Calculate total hours
  const totalHours = shifts.reduce((acc, shift) => {
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    return acc + (end - start) / (1000 * 60 * 60);
  }, 0);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 py-3 border-b border-gray-200 bg-white gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">My Rostered Shifts</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <button
            onClick={handleToday}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-300 rounded-md min-w-[150px] sm:min-w-[200px] justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-xs sm:text-sm font-medium truncate">{dateRange}</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          </button>

          <Button variant="outline" size="icon" onClick={handleNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

          <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Summary */}
        <div className="w-[120px] sm:w-[185px] border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700">Summary</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Total Hours</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>{totalHours.toFixed(2)} Hrs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded bg-green-100 border border-green-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Shifts</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>{shifts.length} Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading shifts...</div>
            </div>
          ) : (
            <div className="min-w-max">
              {/* Date Headers */}
              <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                {dateColumns.map((col, index) => (
                  <div
                    key={index}
                    className={`w-[120px] sm:w-[140px] px-2 py-3 text-center border-r border-gray-200 ${
                      col.isToday ? 'bg-blue-50' : ''
                    }`}
                  >
                    {col.isToday ? (
                      <div className="text-sm font-bold text-blue-600">TODAY</div>
                    ) : (
                      <>
                        <div className="text-xs font-medium text-gray-700">
                          {col.dayName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {col.dayNum}, {col.monthName}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Shifts Row */}
              <div className="flex min-h-[400px]">
                {dateColumns.map((col, index) => {
                  const dayShifts = getShiftsForDate(col.date);
                  return (
                    <div
                      key={index}
                      className={`w-[120px] sm:w-[140px] border-r border-gray-200 p-1 ${
                        col.isToday ? 'bg-blue-50/30' : 'bg-white'
                      }`}
                    >
                      {dayShifts.length > 0 ? (
                        <div className="space-y-1">
                          {dayShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className="border border-gray-200 rounded overflow-hidden bg-white text-xs"
                            >
                              <div className="px-2 py-1">
                                <div className="font-medium text-gray-900">
                                  {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                </div>
                                <div className="text-gray-600">
                                  ({calculateDuration(shift.startTime, shift.endTime)} Hrs)
                                </div>
                                {shift.site && (
                                  <div className="text-gray-600 flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{shift.site.shortName}</span>
                                  </div>
                                )}
                              </div>
                              <div className="bg-green-500 text-white px-2 py-0.5 font-medium text-center">
                                Confirmed
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-300 text-xs">
                          -
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">{shifts.length} Confirmed Shifts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-700">{totalHours.toFixed(2)} Total Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
