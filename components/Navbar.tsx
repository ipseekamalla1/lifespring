"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/client/doctors" },
    { name: "Services", href: "/client/services"},
    { name: "About", href: "/client/about" },
    { name: "Contact", href: "/client/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/90 backdrop-blur"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo_1_trans.png"
            alt="HealthCare Logo"
            width={260}
            height={40}
            priority
            className="h-30 w-40"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative group transition-colors ${
                  isActive
                    ? "text-[#4ca626]"
                    : "text-gray-700 hover:text-[#4ca626]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#4ca626] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}

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
                className={`relative group transition-colors ${
                  pathname === "/appointments"
                    ? "text-[#4ca626]"
                    : "text-gray-700 hover:text-[#4ca626]"
                }`}
              >
                My Appointments
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#4ca626] transition-all duration-300 ${
                    pathname === "/appointments"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
              <button className="text-red-500 hover:underline">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#4ca626]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t px-6 py-6 flex flex-col gap-5 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`${
                pathname === item.href
                  ? "text-[#4ca626]"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {!user ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 bg-[#4ca626] text-white text-center py-2 rounded-full"
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
