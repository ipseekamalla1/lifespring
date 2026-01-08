"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";

const doctors = [
  {
    name: "Naidan Smith",
    role: "Pediatric Specialist",
    email: "naidan@lifespring.com",
    image: "/images/team/doctor10.jpg",
  },
  {
    name: "Daniel Frankie",
    role: "General Physician",
    email: "daniel@lifespring.com",
    image: "/images/team/doctor2.jpg",
  },
  {
    name: "Alexa John",
    role: "Dermatologist",
    email: "alexa@lifespring.com",
    image: "/images/team/doctor3.jpg",
  },
  {
    name: "Michael Ross",
    role: "Cardiologist",
    email: "michael@lifespring.com",
    image: "/images/team/doctor4.jpg",
  },
  {
    name: "Sophia Turner",
    role: "Neurologist",
    email: "sophia@lifespring.com",
    image: "/images/team/doctor5.jpg",
  },
  {
    name: "James Carter",
    role: "Orthopedic Surgeon",
    email: "james@lifespring.com",
    image: "/images/team/doctor6.jpg",
  },
  {
    name: "Emily Watson",
    role: "Dental Surgeon",
    email: "emily@lifespring.com",
    image: "/images/team/doctor7.jpg",
  },
  {
    name: "Olivia Brown",
    role: "Gynecologist",
    email: "olivia@lifespring.com",
    image: "/images/team/doctor8.jpg",
  },
  {
    name: "Ethan Miller",
    role: "Internal Medicine",
    email: "ethan@lifespring.com",
    image: "/images/team/doctor9.jpg",
  },
];

export default function MeetOurTeam() {
  return (
    <section className="w-full py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="uppercase tracking-widest text-sm font-semibold text-[#4ca626]">
            Our Team
          </p>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Meet The Perfect Team
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 bg-[#4ca626] rounded-full" />

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Our experienced doctors bring compassion, expertise, and dedication
            to every patient interaction.
          </p>
        </motion.div>

        {/* TEAM GRID */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">

                {/* IMAGE */}
                <div className="relative h-[380px] overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="
                      object-cover transition-transform duration-500
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* INFO CARD */}
                <div
                  className="
                    relative bg-white text-center px-6 py-8
                    transition-all duration-300
                    group-hover:-translate-y-4
                  "
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {doctor.name}
                  </h3>

                  <p className="text-[#4ca626] font-medium mt-1">
                    {doctor.role}
                  </p>

                  <div className="h-px w-full bg-gray-200 my-4" />

                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <Mail size={16} />
                    <span>{doctor.email}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
