"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Phone, User, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ================= TYPES ================= */

type Note = {
  id: string;
  note: string;
  createdAt: string;
  doctor?: { name?: string | null };
};

type Prescription = {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration?: string | null;
  instructions?: string | null;
  createdAt: string;
};

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  patient: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
};

export default function DoctorViewAppointmentPage() {
  const { id } = useParams<{ id: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newNote, setNewNote] = useState("");

  const [form, setForm] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const safeFetch = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, { credentials: "include", ...options });
    if (!res.ok) throw new Error("Failed");
    return res.json();
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [a, n, p] = await Promise.all([
        safeFetch(`/api/doctor/appointments/${id}`),
        safeFetch(`/api/appointments/${id}/notes`),
        safeFetch(`/api/appointments/${id}/prescriptions`),
      ]);
      setAppointment(a);
      setNotes(n);
      setPrescriptions(p);
    } catch {
      toast.error("Failed to load appointment");
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await safeFetch(`/api/appointments/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote }),
      });
      setNewNote("");
      toast.success("Note added");
      loadAll();
    } catch {
      toast.error("Failed to add note");
    }
  };

  const addPrescription = async () => {
    if (!form.medication || !form.dosage || !form.frequency) {
      toast.error("Medication, dosage & frequency required");
      return;
    }
    try {
      await safeFetch(`/api/appointments/${id}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Prescription added");
      setForm({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });
      loadAll();
    } catch {
      toast.error("Failed to add prescription");
    }
  };

  if (!appointment) {
    return <div className="p-10 text-sm text-green-700/60">Loading…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10 bg-green-50/30">

      {/* SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#4ca626]/30 rounded-2xl p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-[#4ca626] mb-3">
          Appointment Details
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-green-900">
          <div className="flex items-center gap-2">
  <User size={16} className="text-[#4ca626]" />
  {`${appointment.patient.firstName || ""} ${appointment.patient.lastName || ""}`.trim() || "Unknown"}
</div>


          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[#4ca626]" />
            {new Date(appointment.date).toLocaleString()}
          </div>

          {appointment.patient.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#4ca626]" />
              {appointment.patient.phone}
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-green-800">
          <span className="font-medium text-green-900">Reason:</span> {appointment.reason}
        </p>
      </motion.div>

      {/* NOTES */}
      <div className="bg-white border border-[#4ca626]/30 rounded-2xl p-6 shadow-md space-y-5">
        <h2 className="text-lg font-semibold text-[#4ca626]">Clinical Notes</h2>

        {notes.length === 0 && <p className="text-sm text-green-700/70">No notes yet.</p>}

        <div className="space-y-3">
          {notes.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#4ca626]/10 border-l-4 border-[#4ca626] rounded-lg p-4"
            >
              <p className="text-sm text-green-900">{n.note}</p>
              <p className="text-xs text-green-700 mt-1">
                {n.doctor?.name ?? "Doctor"} • {new Date(n.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new clinical note…"
          className="w-full border border-[#4ca626]/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#4ca626] outline-none"
        />

        <Button className="bg-[#4ca626] hover:bg-green-700" onClick={addNote}>
          <Plus size={16} /> Add Note
        </Button>
      </div>

      {/* PRESCRIPTIONS */}
      <div className="bg-white border border-[#4ca626]/30 rounded-2xl p-6 shadow-md space-y-4">
        <h2 className="text-lg font-semibold text-[#4ca626]">Prescriptions</h2>

        <div className="grid gap-3">
          {prescriptions.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 bg-green-50 hover:shadow-md transition"
            >
              <p className="font-medium text-green-900">{p.medication}</p>
              <p className="text-sm text-green-800">{p.dosage} • {p.frequency}</p>
              {p.duration && <p className="text-xs text-green-700">Duration: {p.duration}</p>}
              {p.instructions && <p className="text-xs text-green-700">{p.instructions}</p>}
            </div>
          ))}
        </div>

        {/* ADD PRESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {["medication", "dosage", "frequency", "duration"].map((field) => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="border border-[#4ca626]/50 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#4ca626] outline-none"
            />
          ))}
          <textarea
            placeholder="Instructions (optional)"
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            className="border border-[#4ca626]/50 rounded-lg p-2 text-sm md:col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
          />
        </div>

        <Button className="bg-[#4ca626] hover:bg-green-700" onClick={addPrescription}>
          <Plus size={16} /> Add Prescription
        </Button>
      </div>
    </div>
  );
}
