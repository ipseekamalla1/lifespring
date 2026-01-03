"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarDays,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const statusStyles: Record<Appointment["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/doctor/appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: Appointment["status"]
  ) => {
    await fetch("/api/doctor/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    toast.success("Appointment updated");
    fetchAppointments();
  };

  const filteredAppointments = useMemo(() => {
    if (!search) return appointments;
    const q = search.toLowerCase();
    return appointments.filter(
      a =>
        a.patient?.name?.toLowerCase().includes(q) ||
        a.patient?.phone?.includes(q) ||
        a.reason.toLowerCase().includes(q)
    );
  }, [appointments, search]);

  if (loading) {
    return <div className="p-8 text-emerald-700">Loading appointments…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-emerald-900">
          My Appointments
        </h1>
        <p className="text-sm text-emerald-700">
          Manage your scheduled patient appointments
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <input
          placeholder="Search patient / phone / reason"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm text-center text-gray-500">
            No appointments found
          </div>
        )}

        {filteredAppointments.map((appt, index) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* LEFT */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <User size={18} />
                  {appt.patient?.name || "Unknown Patient"}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarDays size={16} />
                    {new Date(appt.date).toLocaleString()}
                  </div>

                  {appt.patient?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      {appt.patient.phone}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {appt.reason}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[appt.status]}`}
                >
                  {appt.status}
                </span>

                {appt.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() =>
                        updateStatus(appt.id, "CONFIRMED")
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() =>
                        updateStatus(appt.id, "CANCELLED")
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
