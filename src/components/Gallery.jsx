import { useEffect, useState } from "react";
import AOS from "aos";
import { Eye, X } from "lucide-react";

const HERO_IMAGE = "/hero1.png";

// src: "" shows an elegant placeholder. Add the image path when you have it.
const galleryItems = [
  { id: 1, title: "Presidential Suite", category: "Rooms", src: "/room.jpeg" },
  { id: 2, title: "Infinity Pool", category: "Facilities", src: "/pool.jpeg" },
  { id: 3, title: "Fine Dining Restaurant", category: "Dining", src: "/dining.jpeg" },
  { id: 5, title: "Spa & Wellness", category: "Facilities", src: "/spa.jpeg" },
  { id: 6, title: "Rooftop Bar", category: "Dining", src: "/singletable.jpeg" },
  { id: 7, title: "Deluxe King", category: "Rooms", src: "/room.jpeg" },
  { id: 8, title: "Hotel Exterior at Night", category: "Facilities", src: "/hotelnight.jpeg" },
  { id: 9, title: "Conference Hall", category: "Events", src: "/conference.jpeg" },
  { id: 10, title: "Luxury Bedroom", category: "Rooms", src: "/room.jpeg" },
  { id: 11, title: "Marble Bathroom", category: "Rooms", src: "/bathroom.jpeg" },
  { id: 12, title: "Hotel Lobby", category: "Facilities", src: "/reception.jpeg" },
];

const categories = ["All", "Rooms", "Dining", "Facilities", "Events"];

// Shown when an item has no image yet
function Placeholder({ title, category }) {
  return (
    <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
      <div className="absolute inset-3 border border-amber-400/20"></div>
      <div className="text-center px-4">
        <p className="text-amber-400/80 text-lg font-serif tracking-[6px]">
          LUMIÈRE
        </p>
        <div className="w-8 h-px bg-amber-400/40 mx-auto my-3"></div>
        <p className="text-[10px] uppercase tracking-[3px] text-gray-600">
          {category}
        </p>
      </div>
    </div>
  );
}

function Gallery() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const visibleItems =
    active === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === active);

  // Re-detect animated elements after the filter changes
  useEffect(() => {
    AOS.refreshHard();
  }, [active]);

  // Close lightbox with Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-black text-white">

      {/* ================= HERO ================= */}
      <section
        className="relative h-[360px] sm:h-[440px] md:h-[520px] bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black"></div>

        {/* Perfectly centered content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div data-aos="fade-up">
            <p className="text-amber-400 uppercase tracking-[4px] text-xs md:text-sm mb-5">
              Lumière Grand Hotel
            </p>

            <div className="w-16 h-px bg-amber-400 mx-auto mb-6"></div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-wide text-stone-50">
              Gallery
            </h1>

            <p className="mt-5 text-stone-200/80 text-sm md:text-lg tracking-wide">
              Moments of our world-class experience
            </p>
          </div>
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 md:px-7 py-2.5 text-xs md:text-sm uppercase tracking-widest transition duration-300 cursor-pointer ${
                  active === cat
                    ? "bg-amber-400 text-black"
                    : "text-gray-400 hover:text-amber-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY GRID ================= */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {visibleItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
                className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 hover:border-amber-400/60 transition duration-500 cursor-pointer text-left"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <Placeholder title={item.title} category={item.category} />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col items-center justify-center text-center px-4">
                  <Eye className="w-6 h-6 text-amber-400" />
                  <span className="mt-2 text-amber-400 text-xs uppercase tracking-[3px]">
                    View
                  </span>
                  <span className="mt-3 text-white text-sm font-serif tracking-wide">
                    {item.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LIGHTBOX ================= */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelected(null)}
        >
          <button
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 text-amber-400 hover:text-amber-300 transition cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[75vh] aspect-[4/3] md:aspect-[16/10] border border-amber-400/30 overflow-hidden">
              {selected.src ? (
                <img
                  src={selected.src}
                  alt={selected.title}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <Placeholder title={selected.title} category={selected.category} />
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-amber-400 uppercase tracking-[3px] text-xs">
                {selected.category}
              </p>
              <p className="mt-1 font-serif text-xl tracking-wide">
                {selected.title}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Gallery;