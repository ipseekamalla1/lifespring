"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#4ca626] text-white mt-24 w-full">

      {/* INNER CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 pt-20">

        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

          {/* LOGO */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logo2.png"
              alt="LifeSpring Logo"
              width={220}
              height={80}
              className="object-contain"
            />
          </div>

          {/* DESCRIPTION */}
          <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
            Tailored health services designed around your needs. We enhance
            modern healthcare platforms through thoughtful design, trusted
            systems, and patient-first digital experiences that inspire
            confidence, clarity, and care.
          </p>
        </div>
      </div>

      {/* FULL WIDTH HORIZONTAL LINE */}
      <div className="my-16 w-full h-px bg-white/30" />

      {/* LOWER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* OFFICE */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">
              Office
            </h3>

            <div className="space-y-6 text-white/90 text-base">
              <div className="flex items-start gap-4">
                <MapPin size={22} />
                <p className="leading-relaxed">
                  Germany — <br />
                  785 15h Street, Office 47 <br />
                  Berlin, DE 81566
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Mail size={22} />
                <span>info@email.com</span>
              </div>

              <div className="flex items-center gap-4">
                <Phone size={22} />
                <span>+1 840 841 25 69</span>
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">
              Links
            </h3>

            <ul className="space-y-5 text-lg text-white/90">
              {["Home", "Services", "About Us", "Blog", "Contact Us"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href="/"
                      className="
                        inline-block transition-all duration-300
                        hover:text-white hover:translate-x-1
                      "
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">
              Get in Touch
            </h3>

            <p className="text-white/90 text-lg leading-relaxed">
              Have questions or need assistance? Our healthcare support team is
              always ready to guide you and provide the help you need.
            </p>

            <Link
              href="/contact"
              className="
                inline-block mt-8 px-10 py-4 rounded-full
                bg-white text-[#4ca626] text-lg font-semibold
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
              "
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>

      {/* FULL WIDTH BOTTOM BAR */}
      <div className="border-t border-white/30 w-full">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-base text-white/80">
          <span>
            © {new Date().getFullYear()} LifeSpring. All rights reserved.
          </span>

          <div className="flex gap-8">
            <Link href="/" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
