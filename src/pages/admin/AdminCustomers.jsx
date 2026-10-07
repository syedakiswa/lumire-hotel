import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Users, Mail, Phone, Calendar, DollarSign, RefreshCw } from "lucide-react";
import PageMeta from "../../components/PageMeta";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.admin.getCustomers();
      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load customer profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <PageMeta
        title="Customer Management | Lumière Grand Hotel Admin"
        description="Registered customer directory, stay counts, and lifetime revenue contribution."
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            GUEST RELATIONS &amp; PROFILES
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Customer Management
          </h1>
        </div>

        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-gray-300 hover:text-amber-400 hover:border-amber-400 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4">
          {error}
        </div>
      )}

      {/* Customers Table */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 uppercase tracking-widest text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Contact Email</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Member Since</th>
                <th className="py-4 px-6">Total Bookings</th>
                <th className="py-4 px-6 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Loading guest records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No registered customers in database yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id || c.email} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-6 font-medium text-white text-sm">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-6 text-gray-400 font-mono text-xs">
                      {c.email}
                    </td>
                    <td className="py-3.5 px-6 text-gray-400">{c.phone || "—"}</td>
                    <td className="py-3.5 px-6 text-gray-500">
                      {new Date(c.registrationDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-stone-300 font-medium">
                        {c.totalBookings} reservation{c.totalBookings === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-medium text-amber-400 text-sm">
                      ${(c.totalSpent || 0).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
