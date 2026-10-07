import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[80vh] flex items-center overflow-hidden">
        {/* Hero Image */}
        <img
          src="/hero1.png"
          alt="Lumire Hotel"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pt-28 pb-32 md:pb-40">
            <div className="max-w-2xl text-left text-white">
              <p
                data-aos="fade-down"
                className="text-amber-400 uppercase tracking-[3px] md:tracking-[4px] text-xs md:text-sm mb-4 md:mb-5"
              >
                Welcome to Lumire
              </p>

              <h1
                data-aos="fade-up"
                data-aos-delay="150"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-wide"
              >
                Where Timeless Luxury Meets Exceptional Service
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-5 md:mt-6 text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
              >
                Discover a world of refined comfort, exceptional hospitality,
                and unforgettable moments in the heart of luxury.
              </p>

              {/* Explore Button */}
              <a
                href="#rooms"
                data-aos="zoom-in"
                data-aos-delay="450"
                className="inline-block mt-7 md:mt-8 px-6 md:px-7 py-3 border border-amber-400 text-amber-400 uppercase tracking-widest text-xs md:text-sm hover:bg-amber-400 hover:text-black transition duration-300"
              >
                Explore More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOOKING BAR ================= */}
      <div className="relative z-20 -mt-16 md:-mt-14 px-4 md:px-8 lg:px-16 pb-8">
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="max-w-6xl mx-auto bg-black/90 backdrop-blur-sm border border-white/10 p-4 md:p-5 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check In */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Check-In
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-amber-400"
              />
            </div>

            {/* Check Out */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Check-Out
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-amber-400"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Guests
              </label>
              <select className="w-full bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-amber-400">
                <option className="bg-black">1 Guest</option>
                <option className="bg-black">2 Guests</option>
                <option className="bg-black">3 Guests</option>
                <option className="bg-black">4 Guests</option>
                <option className="bg-black">5+ Guests</option>
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                Room
              </label>
              <select className="w-full bg-transparent border-b border-gray-600 text-white py-2 outline-none focus:border-amber-400">
                <option className="bg-black">Any Room</option>
                <option className="bg-black">Deluxe Room</option>
                <option className="bg-black">Executive Suite</option>
                <option className="bg-black">Presidential Suite</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Link
                to="/rooms"
                className="w-full bg-amber-400 text-black py-3 uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition text-center block"
              >
                Search Availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;