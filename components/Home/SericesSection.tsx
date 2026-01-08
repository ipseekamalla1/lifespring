"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  HeartPulse,
  Syringe,
  Pill,
  Smile,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    icon: HeartPulse,
    title: "Cardiac Care",
    desc: "Advanced heart health services focused on prevention, diagnosis, and long-term cardiovascular wellness.",
  },
  {
    icon: Brain,
    title: "Neurology",
    desc: "Comprehensive neurological care addressing disorders of the brain, spine, and nervous system.",
  },
  {
    icon: Syringe,
    title: "Hematology",
    desc: "Specialized evaluation and treatment of blood-related conditions using modern clinical practices.",
  },
  {
    icon: Pill,
    title: "Pharmacology",
    desc: "Medication management guided by research, safety standards, and personalized treatment plans.",
  },
  {
    icon: Smile,
    title: "Dental Services",
    desc: "Complete oral healthcare including preventive care, restorative treatments, and cosmetic dentistry.",
  },
  {
    icon: Activity,
    title: "General Medicine",
    desc: "Holistic medical services for everyday health needs, chronic conditions, and preventive care.",
  },
];

export default function ServicesCarouselSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 380;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-28 bg-[#4ca626]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="uppercase tracking-widest text-sm font-semibold text-white/80">
            Our Medical Services
          </p>

          <h2 className="mt-4 text-4xl font-bold text-white leading-tight">
            Helping You Manage <br /> Every Stage of Health
          </h2>

          <p className="mt-6 text-white/90 text-base leading-relaxed">
            A broad range of healthcare services delivered with expertise,
            compassion, and modern medical standards.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/services"
              className="
                px-8 py-3 rounded-full bg-white text-[#4ca626]
                font-semibold transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
              "
            >
              Read More
            </Link>

            <Link
              href="/appointment"
              className="
                px-8 py-3 rounded-full border border-white text-white
                font-semibold transition-all duration-300
                hover:bg-white hover:text-[#4ca626]
              "
            >
              Appointment
            </Link>
          </div>
        </motion.div>

        {/* CAROUSEL */}
        <div className="relative mt-20">

          {/* LEFT BUTTON */}
          <button
            onClick={() => scroll("left")}
            className="
              hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2
              w-12 h-12 rounded-full bg-white text-[#4ca626]
              items-center justify-center shadow-lg
              hover:scale-105 transition z-10
            "
          >
            <ChevronLeft />
          </button>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => scroll("right")}
            className="
              hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2
              w-12 h-12 rounded-full bg-white text-[#4ca626]
              items-center justify-center shadow-lg
              hover:scale-105 transition z-10
            "
          >
            <ChevronRight />
          </button>

          {/* SCROLL AREA */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-6"
          >
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="
                    bg-white rounded-3xl shadow-xl
                    p-10 w-[340px] flex-shrink-0
                    hover:shadow-2xl
                  "
                >
                  <div className="w-16 h-16 rounded-full bg-[#4ca626]/10 flex items-center justify-center">
                    <Icon className="text-[#4ca626]" size={30} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                    {service.desc}
                  </p>

                  <Link
                    href="/services"
                    className="
                      inline-block mt-6 text-[#4ca626] font-semibold
                      transition-all duration-300 hover:translate-x-1
                    "
                  >
                    Learn More →
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
