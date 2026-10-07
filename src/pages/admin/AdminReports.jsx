import { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  BarChart3,
  DollarSign,
  CalendarCheck,
  XCircle,
  CheckCircle,
  Percent,
  BedDouble,
  RefreshCw,
} from "lucide-react";

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.admin.getReports();
      if (res.success) {
        setReports(res.reports);
      }
    } catch (err) {
      setError(err.message || "Failed to generate hotel intelligence reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-[3px] text-gray-400">Compiling financial &amp; stay analytics...</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...(reports?.monthlyData?.map((m) => m.revenue) || [1]), 1000);
  const maxBookings = Math.max(...(reports?.monthlyData?.map((m) => m.bookings) || [1]), 5);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            FINANCIAL INTELLIGENCE &amp; PERFORMANCE
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Executive Reports
          </h1>
        </div>

        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:text-amber-400 hover:border-amber-400 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-aggregate Reports
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4">
          {error}
        </div>
      )}

      {/* KPI Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-neutral-900/90 border border-amber-400/40 p-6">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs uppercase tracking-widest">Total Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-3xl font-light text-amber-400 mt-2">
            ${(reports?.totalRevenue ?? 0).toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-500 mt-2">Gross booking revenues</p>
        </div>

        <div className="bg-neutral-900/90 border border-white/10 p-6">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-widest">Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-white mt-2">
            {reports?.totalBookings ?? 0}
          </p>
          <p className="text-[11px] text-gray-500 mt-2">
            {reports?.confirmedBookings ?? 0} confirmed • {reports?.cancelledBookings ?? 0} cancelled
          </p>
        </div>

        <div className="bg-neutral-900/90 border border-white/10 p-6">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-widest">Average Occupancy</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-light text-white mt-2">
            {reports?.occupancyRate ?? 0}%
          </p>
          <p className="text-[11px] text-gray-500 mt-2">Confirmed rooms utilisation</p>
        </div>

        <div className="bg-neutral-900/90 border border-white/10 p-6">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-widest">Most Booked Room</span>
            <BedDouble className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-light text-white mt-2 truncate">
            {reports?.mostBookedRoom || "Presidential Suite"}
          </p>
          <p className="text-[11px] text-gray-500 mt-2">Highest guest demand</p>
        </div>
      </div>

      {/* Visual Chart 1: Monthly Revenue Overview */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-light text-white">Monthly Revenue Breakdown</h2>
            <p className="text-xs text-gray-400 mt-1">Generated revenue trajectory across the calendar year</p>
          </div>
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">USD ($)</span>
        </div>

        {/* Bar Chart Container */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 border-b border-white/10">
          {(reports?.monthlyData || []).map((m) => {
            const heightPercent = maxRevenue > 0 ? Math.round((m.revenue / maxRevenue) * 100) : 0;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-amber-400 mb-1 opacity-0 group-hover:opacity-100 transition font-mono">
                  ${m.revenue.toLocaleString()}
                </div>
                <div
                  className="w-full max-w-[36px] bg-amber-400 hover:bg-amber-300 transition-all duration-500 rounded-t-sm"
                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                ></div>
                <span className="text-[11px] text-gray-400 mt-3 font-medium">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Chart 2: Monthly Bookings Volume */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-light text-white">Monthly Reservations Volume</h2>
            <p className="text-xs text-gray-400 mt-1">Total reservations placed each month</p>
          </div>
          <span className="text-xs font-mono text-stone-300 uppercase tracking-widest">Count</span>
        </div>

        <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 border-b border-white/10">
          {(reports?.monthlyData || []).map((m) => {
            const heightPercent = maxBookings > 0 ? Math.round((m.bookings / maxBookings) * 100) : 0;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-stone-200 mb-1 opacity-0 group-hover:opacity-100 transition font-mono">
                  {m.bookings}
                </div>
                <div
                  className="w-full max-w-[36px] bg-stone-500 hover:bg-stone-300 transition-all duration-500 rounded-t-sm"
                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                ></div>
                <span className="text-[11px] text-gray-400 mt-3 font-medium">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
