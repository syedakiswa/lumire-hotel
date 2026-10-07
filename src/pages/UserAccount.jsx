import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { generateBookingInvoice } from "../utils/generateInvoice";
import PageMeta from "../components/PageMeta";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Download,
  XCircle,
  Eye,
  LogOut,
  BedDouble,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function UserAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state: 'bookings' | 'invoices' | 'profile'
  const activeTab = searchParams.get("tab") || "bookings";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
    setError("");
    setSuccessMessage("");
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.bookings.getMyBookings();
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

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    try {
      setActionLoading(true);
      const res = await api.bookings.cancel(cancellingBooking._id || cancellingBooking.bookingId);
      if (res.success) {
        setSuccessMessage("Your booking has been cancelled successfully.");
        setCancellingBooking(null);
        await fetchBookings();
      }
    } catch (err) {
      setError(err.message || "Could not cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
    <div className="min-h-screen bg-black text-white py-12 md:py-20">
      <PageMeta
        title="My Account & Bookings | Lumière Grand Hotel"
        description="Manage your luxury hotel bookings, download official PDF invoices, and review your guest profile at Lumière Grand Hotel."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div data-aos="fade-up" className="border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-amber-400 uppercase tracking-[4px] text-xs mb-2">
              LUMIÈRE GUEST PRIVILEGES
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-white">
              My Account
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Welcome back, <span className="text-stone-200 font-medium">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rooms"
              className="px-5 py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-medium hover:bg-amber-300 transition"
            >
              Book New Room
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-gray-400 text-xs uppercase tracking-widest hover:border-red-400/50 hover:text-red-400 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-white/10 flex items-center gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setTab("bookings")}
            className={`pb-4 px-2 text-xs sm:text-sm uppercase tracking-widest font-medium transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "bookings"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setTab("invoices")}
            className={`pb-4 px-2 text-xs sm:text-sm uppercase tracking-widest font-medium transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "invoices"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices
          </button>

          <button
            onClick={() => setTab("profile")}
            className={`pb-4 px-2 text-xs sm:text-sm uppercase tracking-widest font-medium transition border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mt-6 bg-red-950/40 border border-red-500/40 text-red-300 text-sm p-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {successMessage && (
          <div className="mt-6 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm p-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {successMessage}
            </span>
            <button onClick={() => setSuccessMessage("")} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="mt-8">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs uppercase tracking-[3px] text-gray-400">Loading your reservations...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center border border-white/10 bg-neutral-950/50 p-8">
                <BedDouble className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-light text-white mb-2">No Reservations Found</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  You have not made any hotel bookings yet. Explore our presidential suites and luxury rooms.
                </p>
                <Link
                  to="/rooms"
                  className="inline-block px-7 py-3 bg-amber-400 text-black uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition"
                >
                  Explore Rooms &amp; Suites
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((b) => {
                  const checkInDate = new Date(b.checkIn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const checkOutDate = new Date(b.checkOut).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const bookedOn = new Date(b.bookingDate || b.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={b._id || b.bookingId}
                      className="bg-neutral-950 border border-white/10 hover:border-amber-400/40 transition duration-300 p-6 md:p-8"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">
                              ID: {b.bookingId}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider border ${getStatusBadge(
                                b.status
                              )}`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <h2 className="text-2xl font-light text-white">
                            {b.room?.name || "Luxury Suite"}
                          </h2>
                          <p className="text-xs text-gray-400 mt-1">
                            Booked on: {bookedOn}
                          </p>
                        </div>

                        <div className="text-left lg:text-right">
                          <p className="text-xs uppercase tracking-widest text-gray-400">Total Amount</p>
                          <p className="text-2xl text-amber-400 font-light mt-1">
                            {b.totalAmount ? `$${b.totalAmount.toLocaleString("en-US")}` : "On Request"}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {b.numberOfNights} night{b.numberOfNights > 1 ? "s" : ""} •{" "}
                            {b.pricePerNight ? `$${b.pricePerNight} / night` : "Price on request"}
                          </p>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-xs">
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block mb-1">Check-In</span>
                          <span className="text-stone-200 font-medium text-sm">{checkInDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block mb-1">Check-Out</span>
                          <span className="text-stone-200 font-medium text-sm">{checkOutDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block mb-1">Guests</span>
                          <span className="text-stone-200 font-medium text-sm">{b.guests || "2 Guests"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 uppercase tracking-wider block mb-1">Duration</span>
                          <span className="text-stone-200 font-medium text-sm">{b.numberOfNights} Nights</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-gray-300 text-xs uppercase tracking-widest hover:border-amber-400 hover:text-amber-400 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Booking
                          </button>

                          <button
                            onClick={() => generateBookingInvoice(b)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-amber-400/50 text-amber-400 text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Invoice
                          </button>
                        </div>

                        {b.status !== "Cancelled" && (
                          <button
                            onClick={() => setCancellingBooking(b)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 hover:underline transition cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: INVOICES */}
        {activeTab === "invoices" && (
          <div className="mt-8">
            {bookings.length === 0 ? (
              <div className="py-20 text-center border border-white/10 bg-neutral-950/50 p-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-light text-white mb-2">No Invoices Available</h3>
                <p className="text-gray-400 text-sm">
                  Invoices are generated upon completing a reservation.
                </p>
              </div>
            ) : (
              <div className="bg-neutral-950 border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-black/60 text-xs uppercase tracking-widest text-gray-400 border-b border-white/10">
                      <tr>
                        <th className="py-4 px-6">Invoice #</th>
                        <th className="py-4 px-6">Room</th>
                        <th className="py-4 px-6">Stay Dates</th>
                        <th className="py-4 px-6">Amount</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {bookings.map((b) => (
                        <tr key={b._id || b.bookingId} className="hover:bg-white/[0.02] transition">
                          <td className="py-4 px-6 font-mono text-amber-400">{b.bookingId}</td>
                          <td className="py-4 px-6 text-white font-medium">{b.room?.name || "Room"}</td>
                          <td className="py-4 px-6 text-gray-400">
                            {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6 text-amber-400 font-medium">
                            {b.totalAmount ? `$${b.totalAmount.toLocaleString("en-US")}` : "On Request"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${getStatusBadge(
                                b.status
                              )}`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => generateBookingInvoice(b)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black text-[11px] uppercase tracking-wider font-medium hover:bg-amber-300 transition cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PROFILE */}
        {activeTab === "profile" && (
          <div className="mt-8 max-w-2xl bg-neutral-950 border border-white/10 p-8">
            <h2 className="text-xl font-light text-white mb-6 border-b border-white/10 pb-4">
              Guest Profile &amp; Preferences
            </h2>

            <div className="space-y-5 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Full Name
                </label>
                <div className="text-white font-medium text-base">{user?.name}</div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Email Address
                </label>
                <div className="text-white font-medium text-base">{user?.email}</div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Phone Number
                </label>
                <div className="text-white font-medium text-base">{user?.phone || "Not specified"}</div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Membership Status
                </label>
                <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/40 text-amber-400 text-xs uppercase tracking-widest font-medium">
                  {user?.role === "admin" ? "Hotel Administrator" : "Distinguished Guest (VIP)"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIEW BOOKING MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-amber-400/40 max-w-xl w-full p-6 md:p-8 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-amber-400 text-xs uppercase tracking-[3px] mb-1">LUMIÈRE RESERVATION</p>
            <h3 className="text-2xl font-light text-white mb-4">
              {selectedBooking.room?.name || "Luxury Suite"}
            </h3>

            <div className="space-y-4 text-xs border-y border-white/10 py-5 my-5">
              <div className="flex justify-between">
                <span className="text-gray-400">Booking Reference:</span>
                <span className="font-mono text-amber-400">{selectedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="font-medium text-white">{selectedBooking.status}</span>
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
                <span className="text-gray-400">Guests:</span>
                <span className="text-white">{selectedBooking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nights:</span>
                <span className="text-white">{selectedBooking.numberOfNights}</span>
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

      {/* CANCEL CONFIRMATION DIALOG */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/40 max-w-md w-full p-6 sm:p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">Cancel Reservation</h3>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to cancel this booking for{" "}
              <span className="text-amber-400 font-medium">
                {cancellingBooking.room?.name || "your room"}
              </span>{" "}
              ({cancellingBooking.bookingId})?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                disabled={actionLoading}
                onClick={handleCancelBooking}
                className="px-6 py-3 bg-red-600 text-white text-xs uppercase tracking-widest font-medium hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
              <button
                disabled={actionLoading}
                onClick={() => setCancellingBooking(null)}
                className="px-6 py-3 border border-white/20 text-gray-300 text-xs uppercase tracking-widest hover:border-white transition cursor-pointer"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
