"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HeartPulse, Clock } from "lucide-react";

const stats = [
  {
    value: "15+",
    label: "Healthcare Services\nIntegrated",
    icon: HeartPulse,
  },
  {
    value: "10+ Years",
    label: "Combined Medical &\nTechnical Experience",
    icon: Clock,
  },
  {
    value: "100%",
    label: "Secure Patient\nData Protection",
    icon: ShieldCheck,
  },
];

export default function TrustSection() {
  return (
    <section className="w-full bg-[#4ca626] text-white py-20">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-sm font-semibold text-white/80">
              Our Commitment
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Our Only Priority Is to <br />
              <span className="text-white">Keep You Healthy</span>
            </h2>

            <div className="h-1 w-20 bg-white rounded-full mt-6" />

            <p className="mt-6 text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
              We focus on delivering accessible, reliable, and patient-centered
              healthcare solutions. Our platform simplifies appointment booking,
              medical record access, and communication — all while maintaining
              the highest standards of privacy and care.
            </p>
          </motion.div>

          {/* RIGHT STATS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
                >
                  <Icon className="h-10 w-10 mb-4 text-white group-hover:scale-110 transition-transform duration-300" />

                  <h3 className="text-4xl font-bold">{item.value}</h3>

                  <p className="mt-2 text-white/90 whitespace-pre-line">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
