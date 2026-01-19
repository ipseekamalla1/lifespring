"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Video, Calendar } from "lucide-react";

const options = [
  {
    id: "phone",
    title: "Telephone Support",
    subtitle: ["Call us Monday – Friday", "From 8:00 AM to 5:00 PM"],
    desc: "Our friendly representatives are here to assist you in booking an appointment that best fits your schedule.",
    button: "Call Now",
    icon: Phone,
    image: "/images/contact/phone.jpg",
  },
  {
    id: "virtual",
    title: "Virtual Visit",
    subtitle: ["Online consultation", "From anywhere"],
    desc: "Book a secure virtual appointment and connect with a doctor from the comfort of your home.",
    button: "Start Virtual Visit",
    icon: Video,
    image: "/images/contact/virtual.jpg",
  },
  {
    id: "visit",
    title: "In-Person Appointment",
    subtitle: ["Clinic visit", "Flexible scheduling available"],
    desc: "Schedule an in-person visit with our specialists and receive personalized medical care.",
    button: "Book Appointment",
    icon: Calendar,
    image: "/images/contact/visit.jpg",
  },
];

export default function ContactOptionsSection() {
  const [active, setActive] = useState("phone");

  return (
    <section className="w-full py-24 bg-[#f5faf2]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 min-h-[420px]">
          {options.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                onHoverStart={() => setActive(item.id)}
                animate={{ flexBasis: isActive ? "55%" : "22.5%" }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-2xl shadow-xl border border-[#4ca626]/20 bg-white cursor-pointer"
              >
                {/* IMAGE (STABLE SIZE) */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    priority
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-[#4ca626] text-white flex items-center justify-center shadow-md z-10">
                    <Icon size={22} />
                  </div>

                  {!isActive && (
                    <div className="absolute bottom-6 left-0 right-0 text-center px-4 z-10">
                      <h3 className="text-white text-xl font-semibold drop-shadow">
                        {item.title}
                      </h3>
                      <div className="h-1 w-14 bg-[#4ca626] mx-auto mt-2 rounded-full" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="absolute inset-y-0 right-0 w-[340px] bg-white p-10 flex flex-col justify-center"
                  >
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                      {item.title}
                    </h3>

                    <div className="text-sm text-slate-600 mb-4 space-y-1">
                      {item.subtitle.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    <button className="self-start px-6 py-3 bg-[#4ca626] text-white text-sm rounded-lg hover:bg-[#3f8f1f] transition">
                      {item.button}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
