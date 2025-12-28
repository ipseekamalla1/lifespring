"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;

export default function AddAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
    status: "PENDING" as AppointmentStatus,
  });

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    fetch("/api/admin/patients").then(r => r.json()).then(setPatients);
    fetch("/api/admin/doctors").then(r => r.json()).then(setDoctors);
    fetch("/api/admin/appointments").then(r => r.json()).then(setAppointments);
  }, []);

  /* ---------- AVAILABLE SLOTS ---------- */
  const availableSlots = useMemo(() => {
    if (!form.date || !form.doctorId) return [];

    const booked = appointments
      .filter(
        a =>
          a.doctorId === form.doctorId &&
          a.date.split("T")[0] === form.date
      )
      .map(a => new Date(a.date).toTimeString().slice(0, 5));

    const slots: string[] = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const slot = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        if (!booked.includes(slot)) slots.push(slot);
      }
    }

    return slots;
  }, [form.date, form.doctorId, appointments]);

  /* ---------- FORM HANDLERS ---------- */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.patientId || !form.doctorId || !form.date || !form.time || !form.reason) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: `${form.date}T${form.time}:00`,
        reason: form.reason,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to book appointment");
      return;
    }

    router.push("/admin/appointments");
  }

  /* ---------- UI ---------- */
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-emerald-50 to-white min-h-screen">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-emerald-900">Book Appointment</h1>
        <p className="text-sm text-emerald-700">Create a new appointment</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border shadow p-6 space-y-6"
      >
        {/* PATIENT & DOCTOR */}
        <div className="grid md:grid-cols-2 gap-6">
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} — {d.department}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <input
          type="date"
          name="date"
          min={new Date().toISOString().split("T")[0]}
          value={form.date}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />

        {/* SLOTS */}
        {form.date && form.doctorId && (
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-2">
              Available Time Slots
            </p>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.length === 0 && (
                <p className="col-span-4 text-sm text-red-500">
                  No slots available
                </p>
              )}
              {availableSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setForm(prev => ({ ...prev, time: slot }))}
                  className={`py-1 rounded-lg text-sm border
                    ${form.time === slot
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700"}
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* REASON */}
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={4}
          placeholder="Reason for visit"
          className="border rounded-lg p-2 w-full"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg">
            Book
          </button>
        </div>
      </motion.form>
    </div>
  );
}
