import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.admin.getDashboard();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-500/40";
      case "Cancelled":
        return "bg-red-950/80 text-red-400 border-red-500/40";
      case "Completed":
        return "bg-blue-950/80 text-blue-400 border-blue-500/40";
      default:
        return "bg-amber-950/80 text-amber-400 border-amber-500/40";
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-[3px] text-gray-400">Loading hotel metrics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            HOTEL OPERATIONS &amp; INTELLIGENCE
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Dashboard Overview
          </h1>
        </div>
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:text-amber-400 hover:border-amber-400 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4">
          {error}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* Total Rooms */}
        <div className="bg-neutral-900/90 border border-white/10 p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400">Total Rooms</span>
            <BedDouble className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-white mt-4">{stats?.totalRooms ?? 0}</p>
          <p className="text-[11px] text-gray-500 mt-2">Active inventory listed</p>
        </div>

        {/* Total Bookings */}
        <div className="bg-neutral-900/90 border border-white/10 p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400">Total Bookings</span>
            <CalendarCheck className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-white mt-4">{stats?.totalBookings ?? 0}</p>
          <p className="text-[11px] text-gray-500 mt-2">Lifetime reservations created</p>
        </div>

        {/* Total Customers */}
        <div className="bg-neutral-900/90 border border-white/10 p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gray-400">Total Customers</span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-white mt-4">{stats?.totalCustomers ?? 0}</p>
          <p className="text-[11px] text-gray-500 mt-2">Registered guest profiles</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-neutral-900/90 border border-amber-400/30 p-6 relative overflow-hidden bg-gradient-to-br from-neutral-900 to-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-amber-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-amber-400 mt-4">
            ${(stats?.totalRevenue ?? 0).toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-400 mt-2">From confirmed stays</p>
        </div>
      </div>

      {/* Middle Section: Occupancy & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Occupancy Rate */}
        <div className="bg-neutral-900/90 border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray-400">Occupancy Rate</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-light text-white">{stats?.occupancyRate ?? 0}%</span>
              <span className="text-xs text-gray-400">current capacity</span>
            </div>
            <div className="w-full bg-white/10 h-2 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-700"
                style={{ width: `${Math.min(100, stats?.occupancyRate || 0)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-6">
            Based on ratio of active confirmed bookings to total suites.
          </p>
        </div>

        {/* Booking Status Breakdown */}
        <div className="lg:col-span-2 bg-neutral-900/90 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-widest text-gray-400">Booking Status Breakdown</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-black/50 border border-emerald-500/30 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Confirmed</p>
              <p className="text-2xl font-light text-emerald-400 mt-2">
                {stats?.statusCounts?.Confirmed ?? 0}
              </p>
            </div>
            <div className="bg-black/50 border border-amber-500/30 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-light text-amber-400 mt-2">
                {stats?.statusCounts?.Pending ?? 0}
              </p>
            </div>
            <div className="bg-black/50 border border-blue-500/30 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-light text-blue-400 mt-2">
                {stats?.statusCounts?.Completed ?? 0}
              </p>
            </div>
            <div className="bg-black/50 border border-red-500/30 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Cancelled</p>
              <p className="text-2xl font-light text-red-400 mt-2">
                {stats?.statusCounts?.Cancelled ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-base font-light text-white uppercase tracking-wider">
            Recent Reservations
          </h2>
          <Link
            to="/admin/bookings"
            className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 uppercase tracking-wider"
          >
            All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!stats?.recentBookings || stats.recentBookings.length === 0) ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No bookings recorded in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-black/60 uppercase tracking-widest text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Guest</th>
                  <th className="py-3 px-6">Room</th>
                  <th className="py-3 px-6">Dates</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentBookings.map((b) => (
                  <tr key={b._id || b.bookingId} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-mono text-amber-400">{b.bookingId}</td>
                    <td className="py-3.5 px-6 text-white font-medium">
                      {b.user?.name || "Guest"}
                    </td>
                    <td className="py-3.5 px-6">{b.room?.name || "Room"}</td>
                    <td className="py-3.5 px-6 text-gray-400">
                      {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-amber-400 font-medium">
                      {b.totalAmount ? `$${b.totalAmount.toLocaleString("en-US")}` : "On Request"}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
