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
    image: "/images/team/doctor7.jpg",
  },
  {
    name: "Dr. James Wilson",
    role: "Consultant Physician",
    department: "Internal Medicine",
    email: "james.wilson@lifespring.com",
    phone: "+1 (416) 555-0241",
    desc: "Experienced in complex diagnosis, chronic disease management, and clinical excellence.",
    image: "/images/team/doctor2.jpg",
  },
  {
    name: "Dr. Sophia Patel",
    role: "Pediatric Specialist",
    department: "Pediatrics",
    email: "sophia.patel@lifespring.com",
    phone: "+1 (905) 555-0312",
    desc: "Dedicated to compassionate pediatric care and supporting families through every stage.",
    image: "/images/team/doctor3.jpg",
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
                hover:-translate-y-4 hover:shadow-2xl
              "
            >
              {/* IMAGE (60%) */}
              <div className="relative h-[340px] overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="
                    w-full h-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0 bg-gradient-to-t
                    from-black/50 via-black/20 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition duration-500
                  "
                />

                {/* Floating Name Badge */}
                <div
                  className="
                    absolute bottom-5 left-5
                    bg-white/90 backdrop-blur
                    px-4 py-2 rounded-xl
                    shadow-lg
                    transform translate-y-6 opacity-0
                    group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-500
                  "
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {doc.name}
                  </p>
                  <p className="text-xs text-[#4ca626]">
                    {doc.department}
                  </p>
                </div>
              </div>

              {/* CONTENT (40%) */}
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
