import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// Only images that already exist in /public.
// Leave a value as "" to show the clean dark layout instead of an image.
const HERO_IMAGE = "/hero1.png";
const STORY_IMAGE = "/reception.jpeg"; // e.g. "/reception.jpg"
const STANDARD_IMAGE = "/room.jpeg";

const experiences = [
  {
    number: "01",
    title: "Thoughtful Design",
    text: "Every space is designed to create a refined yet welcoming atmosphere.",
  },
  {
    number: "02",
    title: "Personal Service",
    text: "Our team is committed to making every guest feel genuinely valued.",
  },
  {
    number: "03",
    title: "Effortless Comfort",
    text: "From modern amenities to attentive service, everything is designed around you.",
  },
];

const approach = [
  { number: "01", title: "Personalized Service" },
  { number: "02", title: "Exceptional Comfort" },
  { number: "03", title: "Timeless Elegance" },
  { number: "04", title: "Attention to Detail" },
];

const values = [
  {
    number: "01",
    title: "Excellence",
    text: "We never stop looking for ways to improve the guest experience.",
  },
  {
    number: "02",
    title: "Authenticity",
    text: "Warm, genuine hospitality is at the heart of everything we do.",
  },
  {
    number: "03",
    title: "Elegance",
    text: "We believe luxury should feel effortless, timeless, and welcoming.",
  },
  {
    number: "04",
    title: "Care",
    text: "Every guest and every detail deserves our full attention.",
  },
];

const labelClass =
  "text-amber-500 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4";

// Shown when no image is provided
function DarkVisual({ className = "" }) {
  return (
    <div
      className={`relative bg-neutral-950 border border-white/10 flex items-center justify-center ${className}`}
    >
      <div className="absolute inset-4 border border-amber-400/30"></div>
      <div className="text-center px-6">
        <p className="text-3xl font-light tracking-[8px] text-amber-400">
          LUMIRE
        </p>
        <div className="w-10 h-px bg-amber-400/60 mx-auto my-4"></div>
        <p className="text-xs uppercase tracking-[4px] text-gray-500">
          Luxury Hotel
        </p>
      </div>
    </div>
  );
}

function AboutUs() {
  return (
    <div className="bg-black text-white">

      {/* ================= 1. HERO ================= */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div
          data-aos="fade-up"
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <p className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-5">
            Lumire Hotel
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide leading-tight">
            Where Every Stay Becomes a Story
          </h1>
          <p className="mt-6 text-gray-200 text-sm md:text-lg leading-relaxed">
            Discover a hotel shaped by timeless elegance, thoughtful service,
            and unforgettable experiences.
          </p>
        </div>

        {/* Scroll indicator */}
        <a
          href="#story"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-amber-400 hover:text-amber-300 transition"
        >
          <span className="text-[10px] uppercase tracking-[3px]">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </section>

      {/* ================= 2. OUR STORY ================= */}
      <section id="story" className="bg-white text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image (editorial frame) */}
          <div data-aos="fade-right" className="relative lg:pr-6 lg:pb-6">
            <div className="hidden lg:block absolute right-0 bottom-0 w-4/5 h-4/5 border border-amber-500"></div>
            <div className="relative">
              {STORY_IMAGE ? (
                <img
                  src={STORY_IMAGE}
                  alt="Lumire Hotel"
                  className="w-full h-[360px] md:h-[500px] object-cover"
                />
              ) : (
                <DarkVisual className="w-full h-[360px] md:h-[500px]" />
              )}
            </div>
          </div>

          {/* Text */}
          <div data-aos="fade-left">
            <p className={labelClass}>Our Story</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
              Built Around the Art of Hospitality
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Lumire was created with a simple vision — to bring together
              refined design, genuine hospitality, and effortless comfort under
              one roof.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              From the moment you arrive to the moment you leave, every detail
              is thoughtfully considered to make your stay comfortable,
              memorable, and truly exceptional.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="w-12 h-px bg-amber-500"></span>
              <span className="text-xs uppercase tracking-[4px] text-amber-600">
                Discover Lumire
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. THE LUMIRE EXPERIENCE ================= */}
      <section className="bg-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div data-aos="fade-up" className="max-w-2xl mx-auto text-center">
            <p className={labelClass}>The Lumire Experience</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
              More Than a Place to Stay
            </h2>
            <p className="mt-6 text-gray-400 leading-relaxed">
              At Lumire, luxury is not only about beautiful spaces. It is about
              how you feel when you are here — welcomed, cared for, and
              completely at ease.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((item, index) => (
              <div
                key={item.number}
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
                className="border-t border-white/15 pt-6 hover:border-amber-400 transition duration-500"
              >
                <p className="text-amber-400 text-sm tracking-widest">
                  {item.number}
                </p>
                <h3 className="mt-4 text-xl font-light tracking-wide">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. OUR APPROACH ================= */}
      <section className="bg-white text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end">
            <h2
              data-aos="fade-up"
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight"
            >
              Hospitality, With Intention.
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-gray-600 leading-relaxed"
            >
              We believe exceptional hospitality comes from the details. A warm
              welcome, a comfortable room, a memorable meal, and service that
              feels personal — these are the moments that define the Lumire
              experience.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((item, index) => (
              <div
                key={item.number}
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
                className="border border-gray-200 p-7 hover:border-amber-500 transition duration-500"
              >
                <p className="text-amber-600 text-2xl font-light">
                  {item.number}
                </p>
                <p className="mt-6 text-lg font-light tracking-wide">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. THE LUMIRE STANDARD ================= */}
      <section className="bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div data-aos="fade-right" className="min-h-[320px] lg:min-h-[560px]">
            {STANDARD_IMAGE ? (
              <img
                src={STANDARD_IMAGE}
                alt="Lumire luxury room"
                className="w-full h-full min-h-[320px] lg:min-h-[560px] object-cover"
              />
            ) : (
              <DarkVisual className="w-full h-full min-h-[320px] lg:min-h-[560px]" />
            )}
          </div>

          {/* Text */}
          <div
            data-aos="fade-left"
            className="flex items-center px-6 md:px-12 lg:px-16 py-16 md:py-20"
          >
            <div className="max-w-lg">
              <p className={labelClass}>The Lumire Standard</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide leading-tight">
                Designed For Those Who Expect More
              </h2>
              <p className="mt-6 text-gray-400 leading-relaxed">
                From beautifully appointed rooms and curated dining to
                attentive service and thoughtfully selected amenities, Lumire
                brings together everything you need for an exceptional stay.
              </p>
              <Link
                to="/rooms"
                className="inline-block mt-8 px-8 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
              >
                Explore Our Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. OUR VALUES ================= */}
      <section className="bg-neutral-100 text-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-center"
          >
            What We Believe
          </h2>
          <div className="w-16 h-px bg-amber-500 mx-auto mt-6"></div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <div
                key={item.number}
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
                className={`p-8 md:p-10 border transition duration-500 ${
                  index % 2 === 0
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200"
                }`}
              >
                <p className="text-amber-500 text-sm tracking-widest">
                  {item.number}
                </p>
                <h3 className="mt-5 text-2xl font-light tracking-wide">
                  {item.title}
                </h3>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    index % 2 === 0 ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. CLOSING CTA ================= */}
      <section className="bg-black py-24 md:py-32">
        <div
          data-aos="fade-up"
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <p className={labelClass}>Your Next Experience Awaits</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wide leading-tight">
            Stay Somewhere Extraordinary.
          </h2>
          <p className="mt-6 text-gray-400 leading-relaxed">
            Experience the elegance, comfort, and service that make Lumire truly
            unforgettable.
          </p>
          <Link
            to="/rooms"
            className="inline-block mt-10 px-9 py-4 bg-amber-400 text-black uppercase tracking-widest text-xs md:text-sm font-medium hover:bg-amber-300 transition duration-300"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;