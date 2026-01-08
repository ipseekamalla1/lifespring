"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Book Your Appointment",
    desc: "Create an account and schedule your appointment at a time that works best for you — simple, fast, and secure.",
    icon: CalendarCheck,
    offset: "lg:translate-y-0",
  },
  {
    number: "02",
    title: "Share Your Health Details",
    desc: "Provide symptoms, history, or concerns in advance so your doctor is prepared before your visit.",
    icon: FileText,
    offset: "lg:translate-y-10",
  },
  {
    number: "03",
    title: "Consult With a Doctor",
    desc: "Meet your healthcare professional and discuss your condition in a focused and confidential environment.",
    icon: Stethoscope,
    offset: "lg:translate-y-0",
  },
  {
    number: "04",
    title: "Get Your Care Plan",
    desc: "Receive prescriptions, notes, and follow-up guidance tailored specifically to your health needs.",
    icon: ClipboardCheck,
    offset: "lg:translate-y-10",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative w-full py-28 overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/how-it-works-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="uppercase tracking-widest text-sm font-semibold text-[#4ca626]">
            How It Works
          </p>

          <h2 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
            Putting Your Health <br /> First — Every Step
          </h2>

          <div className="h-1 w-20 bg-[#4ca626] rounded-full mt-6" />

          <p className="mt-6 text-gray-600 leading-relaxed">
            A thoughtfully designed process that guides you from your first
            appointment to ongoing care — with clarity, security, and trust.
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={step.offset}
              >
                <div
                  className="
                    group h-full rounded-3xl p-8
                    bg-white border border-gray-100
                    transition-all duration-300
                    hover:bg-[#4ca626]
                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >
                  <span className="text-5xl font-bold text-gray-200 group-hover:text-white/40">
                    {step.number}
                  </span>

                  <div className="mt-6 w-14 h-14 rounded-full bg-[#4ca626]/10 flex items-center justify-center group-hover:bg-white/20">
                    <Icon className="text-[#4ca626] group-hover:text-white" size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-gray-600 text-sm leading-relaxed group-hover:text-white/90">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <Link
            href="/appointment"
            className="
              px-10 py-4 rounded-full
              bg-[#4ca626] text-white font-semibold
              transition-all duration-300
              hover:bg-[#3f8f1f]
              hover:-translate-y-1
              hover:shadow-[0_10px_30px_rgba(76,166,38,0.35)]
            "
          >
            Book Appointment
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
