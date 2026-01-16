"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    title: "Initial Patient Consultation",
    desc: "Understanding symptoms, medical history, and patient concerns.",
    image: "/images/steps/step1.jpg",
  },
  {
    title: "Detailed Medical Diagnosis",
    desc: "Accurate diagnosis using advanced tools and expertise.",
    image: "/images/steps/step2.jpeg",
  },
  {
    title: "Personalized Treatment Planning",
    desc: "Custom treatment plans designed for best outcomes.",
    image: "/images/steps/step3.webp",
  },
  {
    title: "Recovery & Follow-Up Care",
    desc: "Ongoing monitoring and continuous patient support.",
    image: "/images/steps/step4.jpg",
  },
];

export default function CareStepsSection() {
  return (
    <section
      className="relative w-full py-24"
      style={{
        backgroundImage: "url('/images/department/bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* TEXT — LEFT ALIGNED */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20"
        >
          <p className="text-sm uppercase tracking-widest text-green-400 mb-4">
            Our Care, Step by Step
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            We Bring You the Best Treatments and Facilities for Your Health
          </h2>

          <p className="text-gray-200 text-sm md:text-base leading-relaxed">
            The healthcare arena continues to evolve, requiring modern systems
            and improved processes. Our structured approach ensures clarity,
            efficiency, and patient-centered care at every stage.
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="relative flex flex-col md:flex-row items-start justify-between gap-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center max-w-xs"
            >
              {/* IMAGE WITH NUMBER */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 grayscale">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />

                {/* STEP NUMBER */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-4xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* TEXT */}
              <h3 className="mt-6 text-lg font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                {step.desc}
              </p>

              {/* CURVED ARROW */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 -right-28">
                  <svg
                    width="120"
                    height="60"
                    viewBox="0 0 120 60"
                    fill="none"
                  >
                    <path
                      d="M5 30 C40 5, 80 5, 115 30"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                    <defs>
                      <marker
                        id="arrow"
                        markerWidth="6"
                        markerHeight="6"
                        refX="5"
                        refY="3"
                        orient="auto"
                      >
                        <path d="M0 0 L6 3 L0 6" fill="white" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
