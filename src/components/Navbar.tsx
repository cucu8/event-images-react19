import { useState } from "react";
import { navLinks } from "../costants";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = window.location.pathname;
  const search = window.location.search;

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-500 via-pink-400 to-pink-300 shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <a
          href={`${pathname}${search}#davetiye`}
          className="text-3xl font-bold text-white tracking-wide font-dancing-script drop-shadow-lg"
        >
          Image&events
        </a>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`${pathname}${search}${link.href}`}
              className="text-white hover:bg-pink-100/40 hover:text-indigo-700 transition-colors duration-200 font-medium px-4 py-2 rounded-full"
            >
              {link.name}
            </a>
          ))}
        </div>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none bg-white/20 rounded-full shadow"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menüyü Aç/Kapat"
        >
          <span
            className={`block w-6 h-0.5 bg-white mb-1 transition-all ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white mb-1 transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-all ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-500 via-pink-400 to-pink-300 px-4 pb-4 pt-2 flex flex-col gap-4 shadow-lg animate-fade-in-down">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`${pathname}${search}${link.href}`}
              className="text-white hover:bg-pink-100/40 hover:text-indigo-700 transition-colors duration-200 font-medium px-4 py-2 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
