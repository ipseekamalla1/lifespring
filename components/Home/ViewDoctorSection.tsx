"use client";

import { Mail, Phone } from "lucide-react";

const doctors = [
  {
    name: "Dr. Emily Carter",
    role: "Senior Family Physician",
    department: "Family Medicine",
    email: "emily.carter@lifespring.com",
    phone: "+1 (437) 555-0198",
    desc: "Focused on preventive healthcare, long-term wellness, and personalized patient care.",
  },
  {
    name: "Dr. James Wilson",
    role: "Consultant Physician",
    department: "Internal Medicine",
    email: "james.wilson@lifespring.com",
    phone: "+1 (416) 555-0241",
    desc: "Experienced in complex diagnosis, chronic disease management, and clinical excellence.",
  },
  {
    name: "Dr. Sophia Patel",
    role: "Pediatric Specialist",
    department: "Pediatrics",
    email: "sophia.patel@lifespring.com",
    phone: "+1 (905) 555-0312",
    desc: "Dedicated to compassionate pediatric care and supporting families through every stage.",
  },
];

export default function DoctorsSection() {
  return (
    <section className="bg-gray-100 py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mb-20">
          <p className="uppercase tracking-widest text-sm font-semibold text-[#4ca626]">
            Our Doctors
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
            Meet Our Medical Experts
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Trusted professionals delivering compassionate, accurate, and
            patient-first healthcare.
          </p>

          <div className="h-1 w-24 bg-[#4ca626] rounded-full mt-6" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="
                group bg-white rounded-3xl overflow-hidden
                border border-gray-100 shadow-md
                transition-all duration-500
                hover:-translate-y-3 hover:shadow-2xl
              "
            >
              {/* Image - 60% */}
              <div className="relative h-[320px] bg-gradient-to-br from-[#4ca626] to-emerald-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur
                                  flex items-center justify-center
                                  text-white text-4xl font-bold">
                    {doc.name.charAt(0)}
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="
                  absolute inset-0 bg-gradient-to-t
                  from-black/30 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition duration-500
                " />
              </div>

              {/* Content - 40% */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  {doc.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {doc.role}
                </p>

                <span className="inline-block mt-2 text-sm font-medium text-[#4ca626]">
                  {doc.department}
                </span>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {doc.desc}
                </p>

                {/* Contact */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-[#4ca626]" />
                    <span>{doc.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-[#4ca626]" />
                    <span>{doc.phone}</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="
                    mt-8 w-full py-3 rounded-xl text-sm font-semibold
                    bg-[#4ca626] text-white
                    transition-all duration-300
                    hover:bg-emerald-600 hover:shadow-lg
                  "
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
