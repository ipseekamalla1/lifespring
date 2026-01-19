"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function ContactFormSection() {
  return (
    <section className="w-full py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-[45%] bg-[#f5faf2] rounded-2xl overflow-hidden shadow-lg flex flex-col"
          >
            {/* IMAGE */}
            <div className="relative h-[220px] w-full">
              <Image
                src="/images/services-hero.jpg"
                alt="Contact Mediverse"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* CONTENT */}
            <div className="p-8 space-y-7">
              {/* CONTACT US */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4ca626]/10 flex items-center justify-center text-[#4ca626]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Contact Us</p>
                  <p className="text-sm text-slate-600">
                    Lifespring@example.com
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4ca626]/10 flex items-center justify-center text-[#4ca626]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">Medical Address</p>
                  <p className="text-sm text-slate-600">
                    31 New Street, Toronto,
                    <br />
                    Toronto,Canada
                  </p>
                </div>
              </div>

              {/* WORK TIME */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4ca626]/10 flex items-center justify-center text-[#4ca626]">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    Working Hours Details
                  </p>
                  <p className="text-sm text-slate-600">
                    Monday – Saturday
                    <br />
                    7:00 AM – 7:00 PM
                  </p>
                </div>
              </div>

              {/* SOCIALS */}
              <div>
                <p className="text-sm font-medium text-slate-800 mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map(
                    (Icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[#4ca626] hover:bg-[#4ca626] hover:text-white transition cursor-pointer"
                      >
                        <Icon size={18} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:w-[65%] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* TOP TEXT (20%) */}
            <div className="p-10 border-b">
              <p className="text-sm uppercase tracking-wide text-[#4ca626] mb-2">
                We’d love to hear from you
              </p>
              <h3 className="text-3xl font-semibold text-slate-900 mb-3">
                Let’s Talk With Us!
              </h3>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                By submitting this form, you agree to our Privacy Policy. Your
                information is kept confidential and used only to assist with
                your healthcare needs.
              </p>
            </div>

            {/* FORM (80%) */}
            <div className="p-10">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" className="input" />
                <input type="text" placeholder="Last Name" className="input" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input"
                />

                <select className="input md:col-span-2">
                  <option>Select Department</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Neurology</option>
                  <option>General Consultation</option>
                </select>

                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="input md:col-span-2 resize-none"
                />

                <button
                  type="submit"
                  className="md:col-span-2 mt-2 bg-[#4ca626] text-white py-4 rounded-lg font-medium hover:bg-[#3f8f1f] transition"
                >
                  Submit Appointment Request
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
        }
        .input:focus {
          border-color: #4ca626;
          box-shadow: 0 0 0 3px rgba(76, 166, 38, 0.15);
        }
      `}</style>
    </section>
  );
}
