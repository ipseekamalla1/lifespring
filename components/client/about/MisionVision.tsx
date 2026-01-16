"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Eye, HeartHandshake } from "lucide-react";

const sections = [
  {
    id: 0,
    button: "Our Mission",
    icon: Target,
    title: "Our Mission",
    image: "/images/about/mission.jpg",
    content: (
      <>
        <p>
          Our mission is to provide accessible, reliable, and patient-focused
          healthcare by combining clinical expertise with modern digital
          solutions. We strive to simplify healthcare workflows while maintaining
          the highest standards of safety and ethics.
        </p>
        <p className="mt-4">
          Through innovation and continuous improvement, we enable accurate
          diagnosis, efficient care delivery, and sustainable long-term wellness
          for patients, professionals, and healthcare organizations.
        </p>
      </>
    ),
  },
  {
    id: 1,
    button: "Our Vision",
    icon: Eye,
    title: "Our Vision",
    image: "/images/about/vision.jpg",
    content: (
      <>
        <p>
          Our vision is to build a connected, intelligent healthcare ecosystem
          where technology and medical expertise work together seamlessly to
          improve outcomes and efficiency.
        </p>
        <p className="mt-4">
          We aim to shape a future where healthcare is proactive, transparent,
          and personalized—empowering patients and providers through data-driven
          decision-making.
        </p>
      </>
    ),
  },
  {
    id: 2,
    button: "Core Values",
    icon: HeartHandshake,
    title: "Core Values",
    image: "/images/about/core.jpg",
    content: (
      <>
        <p>
          Integrity, compassion, and accountability are at the heart of
          everything we do. We believe trust is built through ethical practices,
          respect, and consistent quality of care.
        </p>
        <p className="mt-4">
          Innovation and collaboration define our culture, enabling us to adapt
          to evolving healthcare challenges while maintaining excellence across
          all services.
        </p>
      </>
    ),
  },
];

export default function MissionVisionSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleChange = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg-green-about.jpg')" }}
      />
      <div className="absolute inset-0 bg-green-950/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <p className="text-lg font-semibold text-[#7CFF4E] mb-4">
            Our Mission & Vision
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Advancing Healthcare With Purpose
          </h2>
          <p className="text-white/90 text-base md:text-lg leading-relaxed">
            We are building a modern healthcare system where technology,
            compassion, and expertise come together to elevate patient care and
            long-term well-being.
          </p>
        </motion.div>

        {/* LARGE STABLE BUTTONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {sections.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleChange(index)}
                className={`relative w-full px-6 py-7 rounded-2xl text-lg font-semibold transition-colors duration-300
                  ${
                    active === index
                      ? "bg-[#7CFF4E] text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Icon className="w-6 h-6" />
                  <span>{item.button}</span>
                </div>

                {/* ACTIVE INDICATOR BAR */}
                {active === index && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 left-0 w-full h-1 bg-black/70 rounded-b-2xl"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT TEXT */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: direction * 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -60 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="text-white/95 text-lg leading-relaxed"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  {sections[active].title}
                </h3>
                {sections[active].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={sections[active].image}
                src={sections[active].image}
                alt={sections[active].title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/25" />
          </div>

        </div>
      </div>
    </section>
  );
}
