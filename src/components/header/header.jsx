
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
    { name: "GITHUB", path: "/github" },
    { name: "LOADER", path: "/loader" },
  ];

  const navClass = ({ isActive }) =>
    `text-xs tracking-widest font-medium transition-colors duration-300
    ${
      isActive
        ? "text-[#f5ff00]"
        : "text-white hover:text-[#f5ff00]"
    }`;

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-[#315b9e] text-white">

      <nav className="flex items-center justify-between px-5 md:px-12 h-20">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-bold italic text-[#f5ff00]"
        >
          DY<span className="text-red-500">.</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navClass}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT BUTTONS */}
        <div className="hidden lg:flex items-center gap-5">

          <Link
            to="/login"
            className="text-xs tracking-widest hover:text-[#f5ff00]"
          >
            LOG IN
          </Link>

          <Link
            to="/get-started"
            className="bg-[#f5ff00] text-[#315b9e] px-5 py-3 text-xs font-bold hover:bg-white transition"
          >
            GET STARTED ↗
          </Link>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-[#f5ff00] text-sm tracking-widest"
        >
          {menuOpen ? "CLOSE −" : "MENU +"}
        </button>

      </nav>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[450px] pb-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-4 border-b border-white/20 text-sm tracking-widest ${
                  isActive
                    ? "text-[#f5ff00]"
                    : "text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="py-4 text-sm tracking-widest"
          >
            LOG IN
          </Link>

          <Link
            to="/get-started"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#f5ff00] text-[#315b9e] p-4 text-center font-bold text-xs"
          >
            GET STARTED ↗
          </Link>

        </div>
      </div>

    </header>
  );
}
