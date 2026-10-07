import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { api } from "../services/api";

// ---- Images: put a path (e.g. "/dining-hero.jpg") or leave "" for placeholder ----
const HERO_IMAGE = "/diningbg.png";
const CHEF_IMAGE = "/chef.png";
const CTA_IMAGE = "/cta.png";

const restaurants = [
  {
    name: "The Grand Restaurant",
    description: "International Cuisine",
    image: "/diningbg.png",
  },
  {
    name: "Sky Lounge",
    description: "Cocktails & Light Bites",
    image: "/hotelnight.jpeg",
  },
  {
    name: "Poolside Grill",
    description: "Grills & Seafood",
    image: "/pool.jpeg",
  },
];

const menuCategories = [
  "All",
  "Starters",
  "Main Course",
  "Seafood",
  "Desserts",
  "Beverages",
];

// Sample menu - edit freely
const menuItems = [
  {
    name: "Truffle Mushroom Soup",
    category: "Starters",
    price: 16,
    description: "Velvety wild mushroom soup finished with black truffle.",
    image: "",
  },
  {
    name: "Burrata & Heirloom Tomato",
    category: "Starters",
    price: 18,
    description: "Fresh burrata, heirloom tomatoes, basil oil and aged balsamic.",
    image: "",
  },
  {
    name: "Wagyu Beef Tenderloin",
    category: "Main Course",
    price: 48,
    description: "Served with seasonal vegetables and our signature sauce.",
    image: "",
  },
  {
    name: "Herb-Roasted Chicken",
    category: "Main Course",
    price: 34,
    description: "Free-range chicken, roasted garlic purée and thyme jus.",
    image: "",
  },
  {
    name: "Grilled Salmon",
    category: "Seafood",
    price: 32,
    description: "Char-grilled salmon with lemon butter and fresh asparagus.",
    image: "",
  },
  {
    name: "Lobster Ravioli",
    category: "Seafood",
    price: 36,
    description: "Handmade ravioli filled with lobster in a light bisque cream.",
    image: "",
  },
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 14,
    description: "Warm dark chocolate cake with a molten centre and vanilla cream.",
    image: "",
  },
  {
    name: "Vanilla Crème Brûlée",
    category: "Desserts",
    price: 12,
    description: "Classic custard with a caramelised sugar crust.",
    image: "",
  },
  {
    name: "Signature Cocktail",
    category: "Beverages",
    price: 18,
    description: "Our bartender's seasonal creation, served over hand-cut ice.",
    image: "",
  },
  {
    name: "Fresh Pressed Juice",
    category: "Beverages",
    price: 9,
    description: "Daily selection of freshly pressed seasonal fruit.",
    image: "",
  },
];

const timeSlots = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
  "9:00 PM", "9:30 PM", "10:00 PM",
];

const guestOptions = [
  "1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests",
  "6 Guests", "7 Guests", "8 Guests", "9+ Guests",
];

const today = new Date().toISOString().split("T")[0];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2 Guests",
  restaurant: restaurants[0].name,
  request: "",
};

const labelClass = "block text-xs uppercase tracking-widest text-gray-500 mb-2";
const fieldClass =
  "w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 text-sm outline-none focus:border-amber-500 transition";

// Elegant placeholder when no image is set
function Placeholder({ label = "" }) {
  return (
    <div className="relative w-full h-full bg-neutral-950 flex items-center justify-center">
      <div className="absolute inset-3 border border-amber-400/20"></div>
      <div className="text-center px-4">
        <p className="text-amber-400/80 text-lg font-serif tracking-[6px]">
          LUMIÈRE
        </p>
        {label && (
          <>
            <div className="w-8 h-px bg-amber-400/40 mx-auto my-3"></div>
            <p className="text-[10px] uppercase tracking-[3px] text-gray-600">
              {label}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Dining() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const visibleItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please enter your name, email address and phone number.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.date || !form.time) {
      setError("Please select a date and time for your reservation.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const res = await api.dining.reserve(form);
      setSuccess(res.reservation || { ...form });
      setForm(emptyForm);
    } catch (err) {
      setError(err.message || "Failed to submit reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white">

      {/* ================= 1. HERO ================= */}
      <section className="relative h-[380px] sm:h-[460px] md:h-[540px] overflow-hidden">
        {HERO_IMAGE ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-neutral-950"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div data-aos="fade-up">
            <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-5">
              Lumière Grand Hotel
            </p>
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-stone-50">
              Dining &amp; Restaurant
            </h1>
            <p className="mt-5 text-stone-200/80 text-sm md:text-lg tracking-wide">
              A culinary journey of flavors
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2. OUR RESTAURANTS ================= */}
      <section className="bg-stone-50 text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div data-aos="fade-up" className="text-center">
            <p className="text-amber-600 uppercase tracking-[4px] text-xs md:text-sm mb-4">
              Restaurants &amp; Bars
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
              Our Restaurants
            </h2>
            <div className="w-16 h-px bg-amber-500 mx-auto mt-6"></div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((r, index) => (
              <div
                key={r.name}
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
                className="group bg-white border border-gray-200 hover:border-amber-500 transition duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Placeholder label="Restaurant" />
                  )}
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="font-serif text-2xl font-light tracking-wide">
                    {r.name}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm">{r.description}</p>
                  <a
                    href="#menu"
                    className="inline-block mt-5 text-amber-600 text-xs uppercase tracking-widest hover:text-amber-500 transition"
                  >
                    View Menu →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. MENU ================= */}
      <section id="menu" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
          <div data-aos="fade-up" className="text-center">
            <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-4">
              Menu
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
              Explore Our Menu
            </h2>
            <div className="w-16 h-px bg-amber-400 mx-auto mt-6"></div>
          </div>

          {/* Tabs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs md:text-sm uppercase tracking-widest transition duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-amber-400 text-black"
                    : "text-gray-400 hover:text-amber-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items - two columns */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8">
            {visibleItems.map((item) => (
              <div
                key={item.name}
                className="flex gap-4 border-b border-white/10 pb-6"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover border border-white/10 shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-serif text-xl font-light tracking-wide">
                      {item.name}
                    </h3>
                    <span className="flex-1 border-b border-dotted border-white/20 translate-y-[-4px]"></span>
                    <span className="text-amber-400 text-lg">
                      ${item.price}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CHEF'S SPECIAL ================= */}
      <section className="bg-neutral-950 border-y border-amber-400/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div data-aos="fade-right" className="relative lg:pr-6 lg:pb-6">
            <div className="hidden lg:block absolute right-0 bottom-0 w-4/5 h-4/5 border border-amber-400/60"></div>
            <div className="relative aspect-[4/3] border border-white/10 overflow-hidden">
              {CHEF_IMAGE ? (
                <img
                  src={CHEF_IMAGE}
                  alt="Wagyu Beef Tenderloin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Placeholder label="Chef's Special" />
              )}
            </div>
          </div>

          <div data-aos="fade-left">
            <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-4">
              Chef&apos;s Special
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
              Wagyu Beef Tenderloin
            </h2>
            <p className="mt-6 text-gray-400 leading-relaxed max-w-lg">
              Perfectly prepared by our executive chef and served with seasonal
              vegetables and signature sauce.
            </p>
            <p className="mt-6 text-4xl font-light text-amber-400">$48</p>
            <a
              href="#menu"
              className="inline-block mt-8 px-8 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
            >
              View Full Menu →
            </a>
          </div>
        </div>
      </section>

      {/* ================= 5 & 6. RESERVATION ================= */}
      <section id="reserve" className="bg-stone-50 text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div data-aos="fade-up" className="text-center">
            <p className="text-amber-600 uppercase tracking-[4px] text-xs md:text-sm mb-4">
              Reservations
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
              Reserve Your Table
            </h2>
            <div className="w-16 h-px bg-amber-500 mx-auto mt-6"></div>
            <p className="mt-6 text-gray-600">
              Join us for an unforgettable dining experience.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              data-aos="fade-up"
              className="lg:col-span-2 bg-white border border-gray-200 p-6 md:p-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (000) 000-0000"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    name="date"
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Time</label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Number of Guests</label>
                  <select
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {guestOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Restaurant / Dining Area</label>
                  <select
                    name="restaurant"
                    value={form.restaurant}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {restaurants.map((r) => (
                      <option key={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Special Request</label>
                  <textarea
                    name="request"
                    rows="5"
                    value={form.request}
                    onChange={handleChange}
                    placeholder="Dietary requirements, celebrations, seating preferences..."
                    className={`${fieldClass} resize-none`}
                  ></textarea>
                </div>
              </div>

              {error && (
                <p className="mt-6 text-sm text-red-600 border border-red-300 bg-red-50 px-4 py-3">
                  {error}
                </p>
              )}

              {success && (
                <div className="mt-6 text-sm text-green-800 border border-green-300 bg-green-50 px-4 py-4">
                  <p className="font-medium">
                    Thank you, {success.name}. Your reservation request has been
                    received.
                  </p>
                  <p className="mt-1">
                    {success.restaurant} · {success.date} at {success.time} ·{" "}
                    {success.guests}. Our team will contact you to confirm.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full bg-amber-400 text-black py-4 uppercase tracking-widest text-sm font-medium hover:bg-amber-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Confirming Table Reservation..." : "Reserve Table →"}
              </button>
            </form>

            {/* Info panel */}
            <aside
              data-aos="fade-up"
              data-aos-delay="150"
              className="bg-black text-white p-8 md:p-10 border border-amber-400/30 h-fit"
            >
              <h3 className="font-serif text-2xl font-light tracking-wide">
                Reservation Information
              </h3>
              <div className="w-10 h-px bg-amber-400 my-5"></div>

              <ul className="space-y-3 text-sm text-gray-400 leading-relaxed list-disc list-inside marker:text-amber-400">
                <li>Reservations are subject to availability.</li>
                <li>Please arrive 10 minutes before your reservation.</li>
                <li>Special requests can be mentioned in advance.</li>
              </ul>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-sm text-gray-300">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  123 Luxury Avenue, Downtown
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <a
                    href="tel:+10001234567"
                    className="hover:text-amber-400 transition"
                  >
                    +1 (000) 123-4567
                  </a>
                </p>
                <p className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <a
                    href="mailto:stay@lumirehotel.com"
                    className="hover:text-amber-400 transition break-all"
                  >
                    stay@lumirehotel.com
                  </a>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ================= 7. FINAL CTA ================= */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {CTA_IMAGE ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${CTA_IMAGE}')` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-neutral-950"></div>
        )}
        <div className="absolute inset-0 bg-black/70"></div>

        <div
          data-aos="fade-up"
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
        >
          <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-4">
            Exquisite Dining
          </p>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-stone-50">
            A Feast for the Senses
          </h2>
          <a
            href="#menu"
            className="inline-block mt-10 px-9 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
          >
            View Menu →
          </a>
        </div>
      </section>

    </div>
  );
}

export default Dining;