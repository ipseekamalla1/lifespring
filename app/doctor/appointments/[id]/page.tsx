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
  doctor?: { name?: string | null }; // ✅ optional
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
    name: string | null;
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

  /* ================= FETCH HELPERS ================= */

  const safeFetch = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, {
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return res.json();
  };

  /* ================= FETCH DATA ================= */

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

  /* ================= ACTIONS ================= */

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
    return <div className="p-10 text-sm text-gray-500">Loading…</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">

      {/* SUMMARY */}
      <div className="bg-white border rounded-xl p-6 space-y-3">
        <h1 className="text-xl font-semibold text-emerald-700">
          Appointment Details
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User size={16} />
            {appointment.patient.name || "Unknown"}
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {new Date(appointment.date).toLocaleString()}
          </div>

          {appointment.patient.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} />
              {appointment.patient.phone}
            </div>
          )}
        </div>

        <p className="text-sm">
          <span className="font-medium">Reason:</span>{" "}
          {appointment.reason}
        </p>
      </div>

      {/* NOTES */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-emerald-700">
          Clinical Notes
        </h2>

        {notes.length === 0 && (
          <p className="text-sm text-gray-500">No notes yet.</p>
        )}

        {notes.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-l-4 border-emerald-500 pl-4 py-2"
          >
            <p className="text-sm text-gray-800">{n.note}</p>
            <p className="text-xs text-gray-500 mt-1">
              {n.doctor?.name ?? "Unknown Doctor"} •{" "}
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </motion.div>
        ))}

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new clinical note…"
          className="w-full border rounded-md p-3 text-sm"
        />

        <Button
          onClick={addNote}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={16} /> Add Note
        </Button>
      </div>

      {/* PRESCRIPTIONS */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-emerald-700">
          Prescriptions
        </h2>

        {prescriptions.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 text-sm">
            <p className="font-medium">{p.medication}</p>
            <p>{p.dosage} • {p.frequency}</p>
            {p.duration && <p>Duration: {p.duration}</p>}
            {p.instructions && (
              <p className="text-gray-500">{p.instructions}</p>
            )}
          </div>
        ))}

        {/* ADD PRESCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Medication"
            value={form.medication}
            onChange={(e) =>
              setForm({ ...form, medication: e.target.value })
            }
            className="border rounded p-2 text-sm"
          />
          <input
            placeholder="Dosage"
            value={form.dosage}
            onChange={(e) =>
              setForm({ ...form, dosage: e.target.value })
            }
            className="border rounded p-2 text-sm"
          />
          <input
            placeholder="Frequency"
            value={form.frequency}
            onChange={(e) =>
              setForm({ ...form, frequency: e.target.value })
            }
            className="border rounded p-2 text-sm"
          />
          <input
            placeholder="Duration (optional)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
            className="border rounded p-2 text-sm"
          />
          <textarea
            placeholder="Instructions (optional)"
            value={form.instructions}
            onChange={(e) =>
              setForm({ ...form, instructions: e.target.value })
            }
            className="border rounded p-2 text-sm md:col-span-2"
          />
        </div>

        <Button
          onClick={addPrescription}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus size={16} /> Add Prescription
        </Button>
      </div>
    </div>
  );
}
