"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserRound,
  Stethoscope,
  Phone,
  CalendarCheck,
  Users,
  Plus,
  X,
} from "lucide-react";

export default function DoctorDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [activeTab, setActiveTab] =
    useState<"appointments" | "patients">("appointments");

  /* ---------------- MODAL STATE ---------------- */
  const [open, setOpen] = useState(false);

  /* ---------------- NEW APPOINTMENT FORM ---------------- */
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  /* ---------------- LOAD DOCTOR ---------------- */
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

  /* ---------------- LOAD PATIENTS WHEN MODAL OPENS ---------------- */
  useEffect(() => {
    if (!open) return;

    fetch("/api/admin/patients")
      .then((res) => res.json())
      .then(setAllPatients)
      .catch(console.error);
  }, [open]);

  /* ---------------- UNIQUE PATIENTS ---------------- */
  const uniquePatients = useMemo(() => {
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
    return <p className="p-6 text-emerald-700">Loading doctor...</p>;
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* ================= DOCTOR PROFILE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border shadow p-6 flex gap-6"
      >
        <div className="p-5 bg-emerald-600 text-white rounded-xl">
          <UserRound size={32} />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-emerald-800">
            Dr. {doctor.name}
          </h1>
          <p className="text-emerald-700">
            {doctor.specialization} — {doctor.department}
          </p>

          <div className="mt-3 flex gap-6 text-sm text-emerald-700">
            <span className="flex items-center gap-1">
              <Stethoscope size={16} />
              {doctor.experience} yrs
            </span>
            <span className="flex items-center gap-1">
              <Phone size={16} />
              {doctor.phone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ================= TABS ================= */}
      <div className="flex gap-4 border-b">
        {[
          { key: "appointments", label: "Appointments", icon: CalendarCheck },
          { key: "patients", label: "Patients", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 flex gap-2 items-center border-b-2 ${
              activeTab === key
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-emerald-600"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ================= APPOINTMENTS ================= */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-2xl border shadow">

          <div className="flex justify-between p-4 border-b">
            <h2 className="font-semibold text-emerald-800">
              Doctor Appointments
            </h2>

            <button
              onClick={() => setOpen(true)}
              className="flex gap-2 items-center bg-emerald-600 text-white px-4 py-2 rounded-xl"
            >
              <Plus size={16} />
              New Appointment
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {doctor.appointments.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.patient?.name}</td>
                  <td className="p-4">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">{a.reason}</td>
                  <td className="p-4">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PATIENTS ================= */}
      {activeTab === "patients" && (
        <div className="bg-white rounded-2xl border shadow">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Phone</th>
              </tr>
            </thead>

            <tbody>
              {uniquePatients.map((p: any) => (
                <tr key={p.id} className="border-t">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.age ?? "—"}</td>
                  <td className="p-4">{p.gender ?? "—"}</td>
                  <td className="p-4">{p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              New Appointment
            </h3>

            <div className="space-y-4">
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select patient</option>
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
