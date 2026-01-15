"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  Droplet,
  Pill,
  Smile,
  Bone,
  Scan,
  Eye,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    id: "01",
    title: "Cardiology",
    description:
      "Advanced heart care focused on accurate diagnosis and long-term prevention. Our cardiology team delivers personalized treatment plans for optimal heart health.",
    icon: HeartPulse,
    image: "/images/department/cardio.jpeg",
    points: [
      "ECG & Echocardiography",
      "Heart disease management",
      "Preventive cardiac care",
    ],
  },
  {
    id: "02",
    title: "Hematology",
    description:
      "Comprehensive evaluation and treatment of blood-related conditions. We use advanced diagnostics to ensure precise and effective care.",
    icon: Droplet,
    image: "/images/department/hema.jpg",
    points: [
      "Anemia & blood disorders",
      "Advanced blood testing",
      "Specialized lab analysis",
    ],
  },
  {
    id: "03",
    title: "Pharmacology",
    description:
      "Safe and effective medication management for improved patient outcomes. Our approach ensures accuracy, safety, and therapeutic effectiveness.",
    icon: Pill,
    image: "/images/department/pharmacology.jpg",
    points: [
      "Medication optimization",
      "Drug interaction monitoring",
      "Clinical pharmacology support",
    ],
  },
  {
    id: "04",
    title: "Dental Care",
    description:
      "Complete oral healthcare services for patients of all ages. From prevention to restoration, we focus on long-term dental wellness.",
    icon: Smile,
    image: "/images/department/dental.jpg",
    points: [
      "Preventive dental care",
      "Cosmetic dentistry",
      "Advanced restorations",
    ],
  },
  {
    id: "05",
    title: "Orthopedics",
    description:
      "Specialized care for bones, joints, and muscles. Our orthopedic experts help restore mobility, strength, and quality of life.",
    icon: Bone,
    image: "/images/department/ortho.jpg",
    points: [
      "Joint & spine care",
      "Sports injury treatment",
      "Rehabilitation planning",
    ],
  },
  {
    id: "06",
    title: "Radiology",
    description:
      "High-precision diagnostic imaging using modern technology. Our radiology services support accurate diagnosis and timely treatment.",
    icon: Scan,
    image: "/images/department/radiology.jpg",
    points: [
      "X-Ray & CT imaging",
      "MRI diagnostics",
      "Digital reporting",
    ],
  },
  {
    id: "07",
    title: "Ophthalmology",
    description:
      "Advanced eye care services focused on vision preservation. We diagnose and treat a wide range of eye conditions with precision.",
    icon: Eye,
    image: "/images/department/opha.jpeg",
    points: [
      "Vision assessment",
      "Eye disease treatment",
      "Surgical eye care",
    ],
  },
  {
    id: "08",
    title: "General Surgery",
    description:
      "Comprehensive surgical care delivered with precision and safety. Our surgeons focus on effective treatment and faster recovery.",
    icon: Stethoscope,
    image: "/images/department/surgery.jpg",
    points: [
      "Minimally invasive surgery",
      "Post-operative care",
      "Experienced surgical team",
    ],
  },
];

export default function ServicesIntro() {
  return (
    <section className="w-full py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-semibold mb-4">
            We’ll Help You Manage a Range of Conditions
          </h2>
          <p className="text-gray-600">
            Patient-centered healthcare services designed to support your
            health through expert care and modern medical practices.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="relative h-[340px] rounded-2xl bg-white border overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              >
                {/* BASE CONTENT */}
                <div className="relative z-10 h-full p-6 flex flex-col">
                  {/* TOP */}
                  <div className="flex items-center justify-between">
                    {/* NUMBER */}
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center">
                      {service.id}
                    </div>

                    {/* ICON */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <Icon className="text-white w-6 h-6" />
                    </div>
                  </div>

                  {/* CENTER CONTENT */}
                  <motion.div
                    variants={{
                      rest: { y: 0 },
                      hover: { y: -8 },
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col justify-center text-center px-2"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                </div>

                {/* HOVER OVERLAY */}
                <motion.div
                  variants={{
                    rest: { opacity: 0, y: "100%" },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 z-20"
                >
                  {/* IMAGE */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${service.image})` }}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/70" />

                  {/* CONTENT */}
                  <div className="relative z-30 h-full p-6 flex flex-col justify-center text-white text-center">
                    <h4 className="text-lg font-semibold mb-4">
                      {service.title}
                    </h4>
                    <ul className="space-y-2 text-sm max-w-[220px] mx-auto">
                      {service.points.map((point, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-green-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
