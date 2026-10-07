import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Shield } from "lucide-react";

const links = [
  { name: "Home", to: "/" },
  { name: "Rooms & Suites", to: "/rooms" },
  { name: "Amenities", to: "/amenities" },
  { name: "About Us", to: "/about" },
  { name: "Gallery", to: "/gallery" },
  { name: "Dining", to: "/dining" },
  { name: "Contact Us", to: "/contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-aos="fade-right"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.png"
            alt="Lumire Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="font-light text-2xl text-amber-400 tracking-wide">
            Lumire
          </h2>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm text-gray-300">
          {links.map((link, i) => (
            <li key={link.name} data-aos="fade-down" data-aos-delay={i * 60}>
              <Link to={link.to} className="hover:text-amber-400 transition">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Actions (Auth aware) */}
        <div className="hidden lg:flex items-center gap-4" data-aos="fade-left">
          {isAuthenticated ? (
            isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 border border-amber-400 text-amber-400 text-xs uppercase tracking-wider rounded-md hover:bg-amber-400 hover:text-black transition"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-1.5 border border-white/20 text-stone-200 text-xs uppercase tracking-wider rounded-md hover:border-amber-400 hover:text-amber-400 transition"
              >
                <User className="w-3.5 h-3.5 text-amber-400" /> My Account
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-amber-400 transition px-2 py-1"
            >
              Login
            </Link>
          )}

          <Link
            to="/rooms"
            className="bg-black/30 text-amber-400 border border-amber-400 rounded-lg py-2 px-4 text-sm hover:bg-amber-500 hover:text-black transition font-medium"
          >
            Book Now
          </Link>
        </div>

        {/* Hamburger Button (mobile/tablet) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden text-amber-400 p-1 cursor-pointer"
        >
          {open ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden bg-black transition-all duration-500 ease-in-out ${
          open ? "max-h-[700px] border-t border-gray-800" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4 text-gray-300">
          {links.map((link) => (
            <li key={link.name} className="border-b border-gray-800/70 last:border-0">
              <Link
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-3 hover:text-amber-400 transition"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Mobile Auth Item */}
          <li className="border-b border-gray-800/70 pt-2 pb-3">
            {isAuthenticated ? (
              isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-amber-400 font-medium py-1"
                >
                  <Shield className="w-4 h-4" /> Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-amber-400 font-medium py-1"
                >
                  <User className="w-4 h-4" /> My Account ({user?.name})
                </Link>
              )
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-1 text-stone-300 hover:text-amber-400 transition"
              >
                Login to Guest Account
              </Link>
            )}
          </li>
        </ul>

        <div className="px-6 pb-5">
          <Link
            to="/rooms"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-amber-400 text-black py-3 rounded-lg uppercase tracking-widest text-xs font-medium hover:bg-amber-300 transition"
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;