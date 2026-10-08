import { Link, useLocation } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const exploreLinks = [
  { name: "Overview", to: "/" },
  { name: "Rooms & Suites", to: "/rooms" },
  { name: "Amenities", to: "/amenities" },
  { name: "Dining", to: "/dining" },
  { name: "About Us", to: "/about" },
  { name: "Gallery", to: "/gallery" },
];


const socials = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
];

function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

    

        {/* Main Columns */}
        <div className="py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div data-aos="fade-up">
            <h2 className="font-light text-3xl text-amber-400 tracking-wide">
              Lumire
            </h2>
            <p className="mt-3 text-white text-sm font-light tracking-wide">
              Where timeless luxury meets exceptional service.
            </p>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              Experience refined comfort, exceptional hospitality, and
              unforgettable moments at Lumire.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center border border-white/15 text-gray-400 hover:text-amber-400 hover:border-amber-400 transition duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-amber-400 uppercase tracking-[3px] text-xs mb-6">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.to} className="hover:text-amber-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-amber-400 uppercase tracking-[3px] text-xs mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span>123 Luxury Avenue, Downtown</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <a href="tel:+10001234567" className="hover:text-amber-400 transition">
                  +1 (000) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <a
                  href="mailto:stay@lumirehotel.com"
                  className="hover:text-amber-400 transition break-all"
                >
                  stay@lumirehotel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-center text-xs text-gray-500">
          <p>© 2026 Lumire Hotel. All rights reserved.</p>
          <p>Designed with elegance.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
