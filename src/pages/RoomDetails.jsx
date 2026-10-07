import { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { generateBookingInvoice } from "../utils/generateInvoice";
import {
  Wifi,
  Snowflake,
  Tv,
  Wine,
  ConciergeBell,
  Bath,
  Clock,
  Building2,
  BedDouble,
  Users,
  Eye,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

const fallbackRoom = {
  _id: "660000000000000000000001",
  slug: "presidential-suite",
  name: "Presidential Suite",
  category: "Luxury Suite",
  price: 890,
  priceOnRequest: false,
  bedType: "King Bed",
  view: "City View",
  maxGuests: 2,
  description:
    "Experience refined comfort in our Presidential Suite, designed with spacious interiors, elegant details, and exceptional amenities for an unforgettable stay.",
  images: ["/room.jpeg", "/bathroom.jpeg", "/roomsbg.png", "/reception.jpeg"],
  amenities: [
    "Free Wi-Fi",
    "Air Conditioning",
    "Smart TV",
    "Mini Bar",
    "Room Service",
    "Luxury Bathroom",
    "24/7 Concierge",
    "City View",
  ],
};

const amenityIcons = {
  "Free Wi-Fi": Wifi,
  "Air Conditioning": Snowflake,
  "Smart TV": Tv,
  "Mini Bar": Wine,
  "Room Service": ConciergeBell,
  "Luxury Bathroom": Bath,
  "24/7 Concierge": Clock,
  "City View": Building2,
};

const today = new Date().toISOString().split("T")[0];

const inputClass =
  "w-full bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-amber-400 [color-scheme:dark]";
const labelClass =
  "block text-xs uppercase tracking-widest text-gray-400 mb-2";

export default function RoomDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(fallbackRoom);
  const [activeImage, setActiveImage] = useState(0);

  // Booking form state
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || "");
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || "");
  const [guests, setGuests] = useState(location.state?.guests || "2 Guests");
  const [specialRequests, setSpecialRequests] = useState("");

  const [available, setAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch room data
  useEffect(() => {
    let isMounted = true;
    const fetchRoom = async () => {
      try {
        const idOrSlug = slug || "presidential-suite";
        const res = await api.rooms.getById(idOrSlug);
        if (isMounted && res.success && res.room) {
          setRoom(res.room);
          setActiveImage(0);
        }
      } catch (err) {
        console.warn("Could not load dynamic room details, using fallback:", err);
      }
    };
    fetchRoom();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000))
      : 0;

  const pricePerNight = room.price || 0;
  const total = nights * pricePerNight;

  const resetStatus = () => {
    setAvailable(false);
    setError("");
    setBookingSuccess(null);
  };

  const handleCheckAvailability = async () => {
    resetStatus();

    if (!checkIn || !checkOut) {
      setError("Please select both Check-In and Check-Out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-Out date must be strictly after Check-In date.");
      return;
    }

    try {
      setCheckingAvailability(true);
      const res = await api.rooms.checkAvailability(room._id, checkIn, checkOut);
      if (res.available) {
        setAvailable(true);
        setError("");
      } else {
        setAvailable(false);
        setError("This room is already reserved for the selected dates. Please select different dates.");
      }
    } catch (err) {
      setError(err.message || "Error verifying availability.");
      setAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookNow = async () => {
    // If not authenticated, redirect to login preserving state
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          redirectTo: location.pathname,
          checkIn,
          checkOut,
          guests,
        },
      });
      return;
    }

    if (!available) {
      setError("Please check room availability before confirming your booking.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      const payload = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests,
        specialRequests,
      };

      const res = await api.bookings.create(payload);
      if (res.success && res.booking) {
        setBookingSuccess(res.booking);
        setAvailable(false);
      }
    } catch (err) {
      setError(err.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const images = Array.isArray(room.images) && room.images.length > 0
    ? room.images
    : ["/room.jpeg", "/bathroom.jpeg", "/roomsbg.png"];

  const amenitiesList = Array.isArray(room.amenities) && room.amenities.length > 0
    ? room.amenities
    : ["Free Wi-Fi", "Air Conditioning", "Smart TV", "Luxury Bathroom"];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
        {/* ================= BREADCRUMB ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-gray-400">
            <Link to="/rooms" className="hover:text-amber-400 transition">
              Rooms &amp; Suites
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-white">{room.name}</span>
          </p>

          <Link
            to="/rooms"
            className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest hover:text-amber-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* ================= GALLERY ================= */}
          <div data-aos="fade-up" className="lg:col-start-1 lg:row-start-1">
            <div className="overflow-hidden border border-white/10 relative">
              <img
                src={images[activeImage] || images[0]}
                alt={room.name}
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px] object-cover transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-black/80 text-amber-400 text-xs uppercase tracking-widest px-3 py-1.5 border border-amber-400/30">
                {room.category}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden border transition cursor-pointer ${
                    activeImage === index
                      ? "border-amber-400"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${room.name} view ${index + 1}`}
                    className="w-full h-16 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= INFO + BOOKING ================= */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {/* Room Info */}
            <div data-aos="fade-up" data-aos-delay="100">
              <p className="text-amber-400 uppercase tracking-[3px] text-xs mb-3">
                {room.category}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
                {room.name}
              </h1>

              <div className="mt-4">
                {room.price ? (
                  <p>
                    <span className="text-3xl text-amber-400 font-light">
                      ${room.price}
                    </span>
                    <span className="text-gray-400"> / night</span>
                  </p>
                ) : (
                  <p className="text-xl text-stone-300 italic font-light">
                    Price on request
                  </p>
                )}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-amber-400" />
                  {room.bedType || "King Bed"}
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  {room.maxGuests ? `${room.maxGuests} Guests` : "2 Guests"}
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  {room.view || "City View"}
                </li>
              </ul>

              <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Booking Card */}
            <div
              id="book"
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-8 bg-neutral-950 border border-white/10 p-6 md:p-8"
            >
              <h2 className="text-xl font-light tracking-wide mb-6">
                Check Availability &amp; Reserve
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Check-In</label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      resetStatus();
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Check-Out</label>
                  <input
                    type="date"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      resetStatus();
                    }}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value);
                      resetStatus();
                    }}
                    className={inputClass}
                  >
                    <option className="bg-black">1 Guest</option>
                    <option className="bg-black">2 Guests</option>
                    <option className="bg-black">3 Guests</option>
                    <option className="bg-black">4 Guests</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Special Requests (Optional)</label>
                  <textarea
                    rows="2"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Airport pickup, high floor, anniversary setup..."
                    className={`${inputClass} resize-none`}
                  ></textarea>
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="mt-6 w-full border border-amber-400 text-amber-400 py-3 uppercase tracking-widest text-xs hover:bg-amber-400 hover:text-black transition duration-300 cursor-pointer disabled:opacity-50"
              >
                {checkingAvailability ? "Checking Backend..." : "Check Availability"}
              </button>

              {/* Messages */}
              {error && (
                <div className="mt-4 text-xs text-red-300 border border-red-500/40 bg-red-950/30 px-4 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {available && (
                <div className="mt-4 text-xs text-emerald-300 border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suite is available for your requested dates!</span>
                </div>
              )}

              {/* Price Summary */}
              {available && (
                <div className="mt-6 border-t border-white/10 pt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Suite</span>
                    <span>{room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nightly Rate</span>
                    <span>
                      {room.price ? `$${room.price} / night` : "Price on request"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stay Duration</span>
                    <span>{nights} night{nights > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-4 text-lg">
                    <span>Estimated Total</span>
                    <span className="text-amber-400 font-medium">
                      {room.price ? `$${total.toLocaleString("en-US")}` : "On Request"}
                    </span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              {!bookingSuccess && (
                <button
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                  className="mt-6 w-full bg-amber-400 text-black py-4 uppercase tracking-widest text-sm font-medium hover:bg-amber-300 transition cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading
                    ? "Confirming Reservation..."
                    : !isAuthenticated
                    ? "Login to Reserve Room"
                    : "Book Now"}
                </button>
              )}

              {/* Booking Success Confirmation */}
              {bookingSuccess && (
                <div className="mt-6 bg-neutral-900 border border-emerald-500/50 p-6 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <div>
                      <h3 className="font-medium text-white text-base">
                        Reservation Confirmed!
                      </h3>
                      <p className="text-xs text-gray-400">
                        Booking Reference:{" "}
                        <span className="font-mono text-amber-400 font-semibold">
                          {bookingSuccess.bookingId}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300">
                    Your luxury stay has been guaranteed. You can view this reservation anytime in your guest dashboard.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => generateBookingInvoice(bookingSuccess)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-amber-400 text-black text-xs uppercase tracking-widest font-medium hover:bg-amber-300 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Invoice
                    </button>
                    <Link
                      to="/account"
                      className="flex-1 inline-flex items-center justify-center py-2.5 border border-white/20 text-white text-xs uppercase tracking-widest hover:border-amber-400 transition"
                    >
                      View in My Bookings
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= AMENITIES ================= */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="lg:col-start-1 lg:row-start-2"
          >
            <h2 className="text-2xl font-light tracking-wide">
              Room Amenities
            </h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenitiesList.map((amenityName) => {
                const IconComponent = amenityIcons[amenityName] || Wifi;
                return (
                  <div
                    key={amenityName}
                    className="flex items-center gap-4 border border-white/10 bg-neutral-950 px-5 py-4"
                  >
                    <IconComponent className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-sm text-gray-300">{amenityName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}