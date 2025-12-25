"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserRound,
  Stethoscope,
  Phone,
  CalendarCheck,
  Users
} from "lucide-react";

export default function DoctorDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"appointments" | "patients">(
    "appointments"
  );

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch doctor");
        return res.json();
      })
      .then(setDoctor)
      .catch(console.error);
  }, [id]);

  const patients = useMemo(() => {
    if (!doctor?.appointments) return [];

    const map = new Map();
    doctor.appointments.forEach((a: any) => {
      if (a.patient && !map.has(a.patient.id)) {
        map.set(a.patient.id, a.patient);
      }
    });
    return Array.from(map.values());
  }, [doctor]);

  if (!doctor) {
    return <p className="text-emerald-700 p-6">Loading doctor...</p>;
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* DOCTOR PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-emerald-100 shadow-md p-6 flex items-center gap-6"
      >
        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
          <UserRound size={32} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-emerald-800">
            Dr. {doctor.name}
          </h1>
          <p className="text-emerald-700">
            {doctor.specialization} — {doctor.department}
          </p>

          <div className="mt-3 flex gap-6 text-sm text-emerald-700/80">
            <span className="flex items-center gap-1">
              <Stethoscope size={16} />
              {doctor.experience} yrs experience
            </span>
            <span className="flex items-center gap-1">
              <Phone size={16} />
              {doctor.phone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-emerald-100">
        {[
          { key: "appointments", label: "Appointments", icon: CalendarCheck },
          { key: "patients", label: "Patients", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition
              ${
                activeTab === key
                  ? "border-emerald-600 text-emerald-800"
                  : "border-transparent text-emerald-600 hover:text-emerald-800"
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {doctor.appointments.map((a: any) => (
                <tr
                  key={a.id}
                  className="border-t border-emerald-100 hover:bg-emerald-50/50"
                >
                  <td className="p-4">{a.patient?.name || "—"}</td>
                  <td className="p-4">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{a.reason}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          a.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : a.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "patients" && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-t border-emerald-100 hover:bg-emerald-50/50"
                >
                  <td className="p-4">{p.name || "—"}</td>
                  <td className="p-4">{p.age ?? "—"}</td>
                  <td className="p-4">{p.gender ?? "—"}</td>
                  <td className="p-4">{p.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
