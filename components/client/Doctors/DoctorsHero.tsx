"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DoctorsHero() {
  return (
    <section className="relative w-full h-[50vh] min-h-[420px] overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/doctors-hero.jpg')", // replace image
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
            <span className="text-white">Doctors</span>
          </p>

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Meet Our <br /> Medical Specialists
          </h1>

          {/* LINE */}
          <div className="h-1 w-24 bg-[#4ca626] rounded-full mt-6" />

          {/* SUBTEXT */}
          <p className="mt-6 text-white/90 text-lg leading-relaxed">
            Experienced, compassionate professionals dedicated to delivering
            trusted and personalized healthcare for every patient.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
