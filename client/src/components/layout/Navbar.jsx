import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  Users,
  Building2,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Video,
  HelpCircle,
  Menu,
  ChevronDown,
  X,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [employeesMenuOpen, setEmployeesMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [operationsMenuOpen, setOperationsMenuOpen] = useState(false);
  const [attendanceMenuOpen, setAttendanceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/scheduler", label: "Scheduler", icon: Calendar },
    { to: "/attendance", label: "Attendance", icon: Clock, hasSubmenu: true, submenuKey: "attendance" },
    { to: "/employees", label: "Employees", icon: Users, hasSubmenu: true, submenuKey: "employees" },
    { to: "/company", label: "Company", icon: Building2, hasSubmenu: true, submenuKey: "company" },
    { to: "/operations", label: "Operations", icon: FileText, hasSubmenu: true, submenuKey: "operations" },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const employeesSubmenu = [
    { label: "Run Compliance Report", to: "/employees/compliance" },
    { label: "Job Applications", to: "/employees/applications" },
    { label: "Leave Management", to: "/employees/leave" },
  ];

  const companySubmenu = [
    { label: "Sites", to: "/company/sites" },
    { label: "Clients", to: "/company/clients" },
  ];

  const operationsSubmenu = [
    { label: "Site Activities", to: "/operations/site-activities" },
  ];

  const attendanceSubmenu = [
    { label: "Time Attendance", to: "/attendance/time" },
    { label: "Export Timesheet", to: "/attendance/export" },
  ];

  const submenus = {
    employees: employeesSubmenu,
    company: companySubmenu,
    operations: operationsSubmenu,
    attendance: attendanceSubmenu,
  };

  const menuStates = {
    employees: employeesMenuOpen,
    company: companyMenuOpen,
    operations: operationsMenuOpen,
    attendance: attendanceMenuOpen,
  };

  const setMenuState = (key, value) => {
    if (key === "employees") setEmployeesMenuOpen(value);
    if (key === "company") setCompanyMenuOpen(value);
    if (key === "operations") setOperationsMenuOpen(value);
    if (key === "attendance") setAttendanceMenuOpen(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className="bg-gray-800 text-white">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.to} className="relative">
                    {item.hasSubmenu ? (
                      <>
                        <NavLink
                          to={item.to}
                          onClick={(e) => {
                            e.preventDefault();
                            setMenuState(item.submenuKey, !menuStates[item.submenuKey]);
                          }}
                          className={({ isActive }) =>
                            `flex flex-col items-center px-4 py-2 text-xs transition-colors rounded ${
                              isActive || menuStates[item.submenuKey]
                                ? "bg-gray-700 text-white"
                                : "hover:bg-gray-700 text-gray-300"
                            }`
                          }
                        >
                          <Icon className="w-5 h-5 mb-1" />
                          <span>{item.label}</span>
                        </NavLink>

                        {/* Dropdown Menu */}
                        {menuStates[item.submenuKey] && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setMenuState(item.submenuKey, false)}
                            />
                            <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg border border-gray-200 rounded-md z-20 w-56">
                              <div className="py-1">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {item.label}
                                </div>
                                {submenus[item.submenuKey].map((subItem, index) => (
                                  <NavLink
                                    key={index}
                                    to={subItem.to}
                                    onClick={() => setMenuState(item.submenuKey, false)}
                                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                  >
                                    {subItem.label}
                                  </NavLink>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex flex-col items-center px-4 py-2 text-xs transition-colors rounded ${
                            isActive
                              ? "bg-gray-700 text-white"
                              : "hover:bg-gray-700 text-gray-300"
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span>{item.label}</span>
                      </NavLink>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <span className="text-sm font-medium">ACE T</span>
              <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* User Menu Hamburger */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 shadow-lg border border-gray-200 rounded-md z-20 w-48">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                          Account
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          ACE T
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button & Brand */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <h1 className="text-lg font-bold">Roster Mechanic</h1>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-gray-400">Account: ACE T</div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300 w-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

    </>
  );
}
