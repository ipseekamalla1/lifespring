"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_1.png"   // 👉 put your logo in /public/logo.png
            alt="HealthCare Logo"
            width={150}
            height={36}
            priority
          />
        
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Home", "Doctors", "About", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative group text-gray-700"
            >
              {item}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#4ca626] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {!user ? (
            <Link
              href="/login"
              className="ml-4 bg-[#4ca626] text-white px-5 py-2 rounded-full hover:bg-[#3f8f1f] transition shadow-sm"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                href="/appointments"
                className="relative group text-gray-700"
              >
                My Appointments
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#4ca626] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <button className="text-red-500 hover:underline">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#4ca626]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t px-6 py-6 flex flex-col gap-5 text-sm font-medium">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/doctors" onClick={() => setOpen(false)}>Doctors</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>

          {!user ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[#4ca626] text-white text-center py-2 rounded-full"
            >
              Login
            </Link>
          ) : (
            <>
              <Link href="/appointments">My Appointments</Link>
              <button className="text-left text-red-500">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
