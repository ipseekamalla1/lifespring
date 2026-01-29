"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/25" />

      {/* Content */}
 <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pt-32 pb-24">        <div className="max-w-3xl">
          
          {/* Small Intro Line */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base font-semibold tracking-wide text-[#4ca626]"
          >
            Your Digital Healthcare Partner
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
          >
            Smarter Healthcare,
            <span className="text-[#4ca626]"> Better Care</span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 bg-[#4ca626] mt-6 rounded-full"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed"
          >
            A modern medical management system designed to simplify appointments,
            securely manage patient records, streamline prescriptions, and deliver
            a seamless experience for both patients and healthcare providers.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10"
          >
            <Link
              href="/client/contact"
              className="
                inline-flex items-center justify-center
                rounded-full px-10 py-4
                bg-[#4ca626] text-white font-semibold
                shadow-lg
                transition-all duration-300
                hover:bg-[#3f8f1f]
                hover:-translate-y-1
                hover:shadow-[0_10px_30px_rgba(76,166,38,0.4)]
                focus:outline-none focus:ring-2
                focus:ring-[#4ca626] focus:ring-offset-2
              "
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
