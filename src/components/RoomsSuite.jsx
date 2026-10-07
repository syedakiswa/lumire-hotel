import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { BedDouble, Users, Eye, ArrowRight } from "lucide-react";
import { api } from "../services/api";
import PageMeta from "./PageMeta";

const HERO_IMAGE = "/roomsbg.png";
const DEFAULT_ROOM_IMAGE = "/room.jpeg";

const fallbackRooms = [
  {
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
      "An extraordinary suite designed for the ultimate luxury experience with elegant interiors and exceptional comfort.",
    images: [DEFAULT_ROOM_IMAGE, "/bathroom.jpeg", "/roomsbg.png"],
    available: true,
  },
  {
    _id: "660000000000000000000002",
    slug: "deluxe-king",
    name: "Deluxe King",
    category: "Luxury Room",
    price: null,
    priceOnRequest: true,
    bedType: "King Bed",
    view: "Garden View",
    maxGuests: 2,
    description:
      "A beautifully appointed room offering modern comfort, sophisticated design, and a peaceful atmosphere.",
    images: [DEFAULT_ROOM_IMAGE, "/bathroom.jpeg"],
    available: true,
  },
  {
    _id: "660000000000000000000003",
    slug: "executive-suite",
    name: "Executive Suite",
    category: "Luxury Suite",
    price: null,
    priceOnRequest: true,
    bedType: "King Bed",
    view: "City View",
    maxGuests: 3,
    description:
      "Sophisticated interiors, generous space, and refined amenities designed for an elevated stay.",
    images: [DEFAULT_ROOM_IMAGE, "/bathroom.jpeg", "/roomsbg.png"],
    available: true,
  },
];

const priceOptions = [
  { label: "All Prices", value: "all" },
  { label: "Under $400", value: "0-399" },
  { label: "$400 - $600", value: "400-600" },
  { label: "$600 - $800", value: "601-800" },
  { label: "$800+", value: "801-99999" },
];
const bedOptions = ["All Types", "King Bed", "Queen Bed", "Twin Beds"];
const viewOptions = ["All Views", "City View", "Garden View", "Ocean View"];

const selectClass =
  "w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 text-sm outline-none focus:border-amber-500 transition";
const labelClass =
  "block text-xs uppercase tracking-widest text-gray-500 mb-2";

function RoomsSuite() {
  const [rooms, setRooms] = useState(fallbackRooms);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("all");
  const [bed, setBed] = useState("All Types");
  const [view, setView] = useState("All Views");

  // Fetch rooms from backend database
  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.rooms.getAll({ price, bed, view });
        if (isMounted && res.success && res.rooms?.length > 0) {
          setRooms(res.rooms);
        }
      } catch (err) {
        console.warn("Using default rooms seed list:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, [price, bed, view]);

  // Re-detect animated elements after the list changes
  useEffect(() => {
    AOS.refreshHard();
  }, [rooms]);

  const resetFilters = () => {
    setPrice("all");
    setBed("All Types");
    setView("All Views");
  };

  return (
    <>
      <PageMeta
        title="Rooms & Suites | Lumière Grand Hotel"
        description="Explore our luxurious presidential suites, deluxe rooms, and executive accommodations designed for exceptional comfort."
      />
      {/* ================= HERO ================= */}
      <section
        className="relative h-[280px] sm:h-[340px] md:h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div data-aos="fade-up" className="text-white">
            <p className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4">
              Lumière Hotel
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
              Rooms &amp; Suites
            </h1>
            <p className="mt-4 text-gray-300 text-sm md:text-lg">
              Elegant Stays for Every Occasion
            </p>
          </div>
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <section
        data-aos="fade-up"
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price</label>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={selectClass}
              >
                {priceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Bed Type</label>
              <select
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                className={selectClass}
              >
                {bedOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClass}>View</label>
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className={selectClass}
              >
                {viewOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROOM GRID ================= */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {rooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-700 text-lg font-light">
                No rooms match your selection.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-7 py-3 border border-amber-500 text-amber-600 uppercase tracking-widest text-xs hover:bg-amber-400 hover:text-black transition duration-300 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, idx) => {
                const roomSlug = room.slug || room._id;
                const roomImage = room.images?.[0] || DEFAULT_ROOM_IMAGE;

                return (
                  <div
                    key={room._id || roomSlug}
                    data-aos="fade-up"
                    data-aos-delay={(idx % 3) * 100}
                    className="group flex flex-col bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition duration-500"
                  >
                    {/* Image */}
                    <div className="overflow-hidden relative">
                      <img
                        src={roomImage}
                        alt={room.name}
                        className="w-full h-[220px] object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-black/75 text-amber-400 text-[10px] uppercase tracking-wider px-2.5 py-1 backdrop-blur-xs">
                        {room.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-2xl font-light tracking-wide text-gray-900">
                        {room.name}
                      </h3>

                      <p className="mt-2">
                        {room.price ? (
                          <>
                            <span className="text-xl text-amber-600 font-medium">
                              ${room.price}
                            </span>
                            <span className="text-sm text-gray-500"> / night</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-600 italic font-medium">
                            Price on request
                          </span>
                        )}
                      </p>

                      <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {room.description}
                      </p>

                      {/* Details */}
                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <BedDouble className="w-4 h-4 text-amber-600" />
                          {room.bedType || "King Bed"}
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-600" />
                          {room.maxGuests ? `${room.maxGuests} Guests` : "2 Guests"}
                        </li>
                        <li className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-amber-600" />
                          {room.view || "City View"}
                        </li>
                      </ul>

                      {/* Action Buttons: View Details & Book Now */}
                      <div className="mt-auto pt-6">
                        <div className="border-t border-gray-200 pt-5 grid grid-cols-2 gap-3">
                          <Link
                            to={`/rooms/${roomSlug}`}
                            className="text-center py-2.5 border border-gray-300 text-gray-700 uppercase tracking-widest text-xs hover:border-black hover:text-black transition duration-300 font-medium"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/rooms/${roomSlug}`}
                            className="text-center py-2.5 bg-amber-500 text-black uppercase tracking-widest text-xs hover:bg-amber-400 transition duration-300 font-medium flex items-center justify-center gap-1"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= BOTTOM SECTION ================= */}
      <section className="bg-black text-white py-20 md:py-28">
        <div
          data-aos="fade-up"
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
            Find Your Perfect Stay
          </h2>
          <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
            Whether you&apos;re traveling for business, relaxation, or a special
            occasion, Lumire offers a space designed around your comfort.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 px-8 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

export default RoomsSuite;