import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { generateBookingInvoice } from "../../utils/generateInvoice";
import {
  CalendarCheck,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.admin.getBookings();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setStatusUpdating(true);
      setError("");
      setSuccess("");
      const res = await api.admin.updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setSuccess(`Booking status successfully changed to ${newStatus}.`);
        if (selectedBooking && (selectedBooking._id === bookingId || selectedBooking.bookingId === bookingId)) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
        await fetchBookings();
      }
    } catch (err) {
      setError(err.message || "Failed to update booking status.");
    } finally {
      setStatusUpdating(false);
    }
  };

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-amber-400 uppercase tracking-[3px] text-xs font-semibold">
            GUEST RESERVATIONS
          </p>
          <h1 className="font-serif text-3xl font-light text-white mt-1">
            Bookings Management
          </h1>
        </div>

        <button
          onClick={fetchBookings}
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
      {success && (
        <div className="mt-6 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm p-4">
          {success}
        </div>
      )}

      {/* Bookings Table */}
      <div className="mt-8 bg-neutral-900/90 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-black/60 uppercase tracking-widest text-gray-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Booking ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Room</th>
                <th className="py-4 px-6">Check-In</th>
                <th className="py-4 px-6">Check-Out</th>
                <th className="py-4 px-6">Guests</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500">
                    Loading reservations...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500">
                    No reservations recorded yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id || b.bookingId} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-6 font-mono text-amber-400 font-medium">
                      {b.bookingId}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-white">{b.user?.name || "Guest"}</div>
                      <div className="text-[11px] text-gray-500">{b.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-6 text-stone-200">
                      {b.room?.name || "Room"}
                    </td>
                    <td className="py-3.5 px-6 text-gray-400">
                      {new Date(b.checkIn).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-gray-400">
                      {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-gray-400">{b.guests || "2"}</td>
                    <td className="py-3.5 px-6 font-medium text-amber-400">
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
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 text-gray-400 hover:text-amber-400 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateBookingInvoice(b)}
                          className="p-1.5 text-gray-400 hover:text-amber-400 transition cursor-pointer"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Status update options */}
                        {b.status !== "Confirmed" && (
                          <button
                            disabled={statusUpdating}
                            onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                            className="p-1.5 text-gray-400 hover:text-emerald-400 transition cursor-pointer"
                            title="Mark Confirmed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== "Cancelled" && (
                          <button
                            disabled={statusUpdating}
                            onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition cursor-pointer"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW BOOKING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-amber-400/40 max-w-xl w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-amber-400 text-xs uppercase tracking-[3px] mb-1">
              RESERVATION DOSSIER
            </p>
            <h3 className="text-2xl font-light text-white mb-2">
              {selectedBooking.room?.name || "Room"}
            </h3>
            <p className="font-mono text-amber-400 text-xs mb-6">
              Reference: {selectedBooking.bookingId}
            </p>

            <div className="space-y-3 text-xs border-y border-white/10 py-5 my-5">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-white/5">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Guest Name</span>
                  <span className="text-white font-medium">{selectedBooking.user?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block mb-0.5">Guest Email</span>
                  <span className="text-white">{selectedBooking.user?.email || "N/A"}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Current Status:</span>
                <span className={`px-2 py-0.5 font-semibold text-[10px] uppercase border ${getStatusBadge(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Check-In:</span>
                <span className="text-white">{new Date(selectedBooking.checkIn).toDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Check-Out:</span>
                <span className="text-white">{new Date(selectedBooking.checkOut).toDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Guests &amp; Duration:</span>
                <span className="text-white">
                  {selectedBooking.guests} • {selectedBooking.numberOfNights} Nights
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rate per Night:</span>
                <span className="text-white">
                  {selectedBooking.pricePerNight ? `$${selectedBooking.pricePerNight}` : "Price on request"}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                <span className="text-white font-medium">Total Amount:</span>
                <span className="text-amber-400 font-semibold">
                  {selectedBooking.totalAmount ? `$${selectedBooking.totalAmount.toLocaleString("en-US")}` : "On Request"}
                </span>
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Change Status:</p>
              <div className="flex flex-wrap gap-2">
                {["Confirmed", "Pending", "Completed", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    disabled={statusUpdating || selectedBooking.status === st}
                    onClick={() => handleUpdateStatus(selectedBooking._id, st)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium border transition cursor-pointer disabled:opacity-40 ${
                      selectedBooking.status === st
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-white/20 text-gray-300 hover:border-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generateBookingInvoice(selectedBooking)}
                className="flex-1 bg-amber-400 text-black py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-amber-300 transition"
              >
                Download Invoice
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 border border-white/20 text-gray-300 text-xs uppercase tracking-widest hover:border-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
