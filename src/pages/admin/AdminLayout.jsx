import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Rooms", to: "/admin/rooms", icon: BedDouble },
    { name: "Bookings", to: "/admin/bookings", icon: CalendarCheck },
    { name: "Customers", to: "/admin/customers", icon: Users },
    { name: "Pricing", to: "/admin/pricing", icon: DollarSign },
    { name: "Reports", to: "/admin/reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-black border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-serif text-amber-400 tracking-[4px] text-lg">LUMIÈRE</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 bg-white/10 px-2 py-0.5">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-amber-400 p-2 focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-light text-2xl tracking-[6px] text-amber-400">
              LUMIÈRE
            </h2>
            <p className="text-[10px] uppercase tracking-[3px] text-gray-400 mt-1">
              ADMINISTRATIVE SUITE
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Info */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <p className="text-xs text-stone-300 font-medium truncate">{user?.name || "Administrator"}</p>
          <p className="text-[11px] text-amber-400/80 truncate">{user?.email}</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={name}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium transition duration-200 rounded-sm ${
                  isActive
                    ? "bg-amber-400 text-black font-semibold shadow-lg"
                    : "text-gray-400 hover:text-amber-400 hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
