"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartPulse, Brain, Eye, Bone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const departments = [
  {
    id: "cardiology",
    title: "Cardiology",
    icon: HeartPulse,
    image: "/images/card.jpg",
    desc:
      "Advanced cardiac care focused on prevention, early diagnosis, and long-term heart health.",
    points: [
      "Heart health assessments",
      "Preventive cardiology programs",
      "Advanced diagnostic tools",
      "Personalized treatment plans",
    ],
  },
  {
    id: "neurology",
    title: "Neurology",
    icon: Brain,
    image: "/images/neuro.jpg",
    desc:
      "Specialized care for neurological disorders affecting the brain and nervous system.",
    points: [
      "Expert neurological evaluation",
      "Migraine & seizure management",
      "Brain and spine diagnostics",
      "Ongoing condition monitoring",
    ],
  },
  {
    id: "eye",
    title: "Eye Care",
    icon: Eye,
    image: "/images/eye.jpg",
    desc:
      "Complete vision care services ensuring clarity, comfort, and long-term eye health.",
    points: [
      "Comprehensive eye exams",
      "Vision correction guidance",
      "Early disease detection",
      "Personalized eye care plans",
    ],
  },
  {
    id: "ortho",
    title: "Orthopaedics",
    icon: Bone,
    image: "/images/ortho.jpg",
    desc:
      "Expert musculoskeletal care focused on mobility, strength, and recovery.",
    points: [
      "Joint & bone evaluations",
      "Injury recovery support",
      "Non-surgical treatments",
      "Rehabilitation planning",
    ],
  },
];

export default function DepartmentsZigZagSection() {
  const [active, setActive] = useState(departments[0]);

  return (
    <section className="bg-gray-100 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="max-w-3xl mb-16">
          <p className="uppercase tracking-widest text-sm font-semibold text-[#4ca626]">
            Our Departments
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
            Medical Expertise <br /> Across Key Specialties
          </h2>

          <p className="mt-6 text-gray-600">
            Explore our core medical departments delivering focused,
            patient-centered care with modern medical practices.
          </p>

          <div className="h-1 w-24 bg-[#4ca626] rounded-full mt-6" />
        </div>

        {/* ICON TABS */}
        {/* ICON TABS – FULL WIDTH */}
<div className="mb-20">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
    {departments.map((dept) => {
      const Icon = dept.icon;
      const isActive = active.id === dept.id;

      return (
        <button
          key={dept.id}
          onClick={() => setActive(dept)}
          className={`
            w-full flex flex-col items-center justify-center
            gap-4 px-6 py-8 rounded-2xl
            transition-all duration-300
            ${
              isActive
                ? "bg-[#4ca626] text-white shadow-2xl scale-[1.03]"
                : "bg-white text-gray-700 hover:shadow-xl"
            }
          `}
        >
          <div
            className={`
              w-16 h-16 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${
                isActive
                  ? "bg-white/20"
                  : "bg-[#4ca626]/10"
              }
            `}
          >
            <Icon
              size={34}
              className={isActive ? "text-white" : "text-[#4ca626]"}
            />
          </div>

          <span className="text-base md:text-lg font-semibold">
            {dept.title}
          </span>
        </button>
      );
    })}
  </div>
</div>


        {/* ZIG-ZAG CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="space-y-24"
          >
            {departments
              .filter((d) => d.id === active.id)
              .map((dept, index) => {
                const reverse = index % 2 !== 0;

                return (
                  <div
                    key={dept.id}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}
                  >
                    {/* IMAGE */}
                    <div className={`${reverse ? "lg:order-2" : ""}`}>
                      <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
                        <Image
                          src={dept.image}
                          alt={dept.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className={`${reverse ? "lg:order-1" : ""}`}>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {dept.title}
                      </h3>

                      <p className="mt-4 text-gray-600 leading-relaxed">
                        {dept.desc}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {dept.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-600"
                          >
                            <span className="mt-1 w-2 h-2 rounded-full bg-[#4ca626]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        className="
                          mt-8 px-8 py-3 rounded-full
                          bg-[#4ca626] text-white font-semibold
                          transition-all duration-300
                          hover:bg-emerald-600 hover:shadow-lg
                        "
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                );
              })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
