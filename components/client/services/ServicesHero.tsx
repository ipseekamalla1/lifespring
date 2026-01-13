"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ServicesHero() {
  return (
    <section className="relative w-full h-[50vh] min-h-[420px] overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/services-hero.jpg')", // replace image
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          {/* BREADCRUMB */}
          <p className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span className="mx-2">→</span>
            <span className="text-white">Services</span>
          </p>

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Our Healthcare <br /> Services
          </h1>

          {/* LINE */}
          <div className="h-1 w-24 bg-[#4ca626] rounded-full mt-6" />

          {/* SUBTEXT */}
          <p className="mt-6 text-white/90 text-lg leading-relaxed">
            Comprehensive medical services designed to support your health,
            recovery, and long-term well-being with trusted care.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
