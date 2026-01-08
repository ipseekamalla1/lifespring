"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldPlus,
  Stethoscope,
  Clock,
  BadgeCheck,
  Zap,
} from "lucide-react";

const points = [
  { icon: HeartHandshake, text: "Compassionate Patient Care" },
  { icon: ShieldPlus, text: "Certified Medical Professionals" },
  { icon: Stethoscope, text: "Expert Clinical Guidance" },
  { icon: Clock, text: "24/7 Healthcare Support" },
  { icon: BadgeCheck, text: "Trusted Medical Standards" },
  { icon: Zap, text: "Fast & Reliable Services" },
];

export default function AboutCareSection() {
  return (
    <section className="w-full py-24 bg-white">
      {/* CONTAINER CONTROLS LEFT & RIGHT GAP */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_30%_35%] gap-8 lg:gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="px-2"
          >
            <p className="uppercase tracking-widest text-sm font-semibold text-[#4ca626]">
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
              Care That Begins <br /> With Understanding
            </h2>

            <div className="h-1 w-20 bg-[#4ca626] rounded-full mt-6" />

            <p className="mt-6 text-gray-600 text-base leading-relaxed">
              Healthcare should go beyond treatment alone. Every interaction is
              guided by empathy, clinical precision, and a commitment to
              delivering care that feels personal, reliable, and truly
              patient-focused.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="text-[#4ca626]" size={20} />
                    <span className="text-gray-700 text-sm">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* CENTER IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-3xl shadow-xl"
            >
              <Image
                src="/images/doctor-potrait.jpg"
                alt="Healthcare Professional"
                width={400}
                height={520}
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 px-2"
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-3xl shadow-xl"
            >
              <Image
                src="/images/medical-team.jpg"
                alt="Medical Team"
                width={500}
                height={300}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <p className="text-gray-600 text-base leading-relaxed">
              Our healthcare professionals focus on combining medical excellence
              with human connection — ensuring every patient feels supported,
              informed, and confident throughout their care journey.
            </p>

            <Link
              href="/about"
              className="
                inline-flex items-center justify-center w-fit
                px-8 py-3 rounded-full
                bg-[#4ca626] text-white font-semibold
                transition-all duration-300
                hover:bg-[#3f8f1f]
                hover:-translate-y-1
                hover:shadow-[0_8px_25px_rgba(76,166,38,0.35)]
              "
            >
              Read More
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
