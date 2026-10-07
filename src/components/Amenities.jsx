import { Link } from "react-router-dom";
import {
  Sparkles,
  Wine,
  ConciergeBell,
  Car,
  Heart,
  Gem,
  Building2,
  Clock,
} from "lucide-react";

// Put an image path here (e.g. "/conference.jpg") to show a photo.
// Leave it empty to show the dark luxury visual instead.
const EXPERIENCE_IMAGE = "";

const amenities = [
  {
    title: "Spa & Wellness",
    icon: Sparkles,
    description:
      "Relax and rejuvenate with luxurious spa treatments, wellness experiences, and a peaceful environment designed for complete relaxation.",
  },
  {
    title: "Rooftop Bar",
    icon: Wine,
    description:
      "Enjoy handcrafted drinks, elegant surroundings, and stunning city views from our exclusive rooftop bar.",
  },
  {
    title: "24/7 Concierge",
    icon: ConciergeBell,
    description:
      "Our dedicated concierge team is available around the clock to assist with reservations, recommendations, transportation, and special requests.",
  },
  {
    title: "Valet Parking",
    icon: Car,
    description:
      "Enjoy effortless arrivals and departures with our convenient professional valet parking service.",
  },
];

const features = [
  { name: "Personalized Service", icon: Heart },
  { name: "Premium Comfort", icon: Gem },
  { name: "Modern Facilities", icon: Building2 },
  { name: "Available Around the Clock", icon: Clock },
];

function Amenities() {
  return (
    <div className="bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="border-b border-white/10 py-20 md:py-28">
        <div
          data-aos="fade-up"
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <p className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4">
            Lumire Experiences
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight">
            Exceptional Amenities
          </h1>

          <div className="w-16 h-px bg-amber-400 mx-auto mt-6"></div>

          <p className="mt-6 text-gray-400 text-sm md:text-lg leading-relaxed">
            Every detail at Lumire is thoughtfully designed to make your stay
            comfortable, relaxing, and unforgettable.
          </p>
        </div>
      </section>

      {/* ================= AMENITIES GRID ================= */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {amenities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  data-aos="fade-up"
                  data-aos-delay={(index + 1) * 100}
                  className="bg-neutral-950 border border-white/10 p-8 transition duration-500 hover:border-amber-400 hover:-translate-y-2 hover:bg-neutral-900"
                >
                  <Icon className="w-12 h-12 text-amber-400 stroke-[1.2]" />

                  <h3 className="mt-6 text-xl font-light tracking-wide">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= EXPERIENCE SECTION ================= */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: image or dark visual */}
          <div data-aos="fade-right">
            {EXPERIENCE_IMAGE ? (
              <img
                src={EXPERIENCE_IMAGE}
                alt="Lumire amenities"
                className="w-full h-[320px] md:h-[420px] object-cover border border-white/10"
              />
            ) : (
              <div className="relative w-full h-[320px] md:h-[420px] bg-neutral-950 border border-white/10 flex items-center justify-center">
                <div className="absolute inset-4 border border-amber-400/30"></div>
                <div className="text-center px-6">
                  <Sparkles className="w-14 h-14 text-amber-400 mx-auto stroke-[1.2]" />
                  <p className="mt-5 text-2xl font-light tracking-[6px] text-amber-400">
                    LUMIRE
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[4px] text-gray-500">
                    Luxury Hotel
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: content */}
          <div data-aos="fade-left">
            <p className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4">
              Designed For You
            </p>

            <h2 className="text-3xl sm:text-4xl font-light tracking-wide leading-tight">
              Everything You Need, All in One Place
            </h2>

            <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
              From moments of relaxation to effortless everyday services,
              Lumire offers carefully selected amenities that complement every
              part of your stay.
            </p>

            <ul className="mt-8 space-y-4">
              {features.map(({ name, icon: Icon }) => (
                <li
                  key={name}
                  className="flex items-center gap-4 border-b border-white/10 pb-4"
                >
                  <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-gray-300 text-sm md:text-base">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 md:py-28 border-t border-white/10">
        <div
          data-aos="fade-up"
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
            Make Your Stay Extraordinary
          </h2>

          <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed">
            Discover the comfort, convenience, and experiences waiting for you
            at Lumire.
          </p>

          <Link
            to="/rooms"
            className="inline-block mt-8 px-8 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Amenities;