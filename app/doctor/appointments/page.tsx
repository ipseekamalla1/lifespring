"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CalendarDays, Phone, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

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

  const updateStatus = async (id: string, status: Appointment["status"]) => {
    try {
      await fetch("/api/doctor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      toast.success("Appointment updated");
      fetchAppointments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!search) return appointments;
    const q = search.toLowerCase();
    return appointments.filter(
      (a) =>
        a.patient?.name?.toLowerCase().includes(q) ||
        a.patient?.phone?.includes(q) ||
        a.reason.toLowerCase().includes(q)
    );
  }, [appointments, search]);

  if (loading) {
    return (
      <div className="p-10 text-sm text-gray-500">Loading appointments…</div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Appointments
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage your patient bookings
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="bg-white border rounded-lg px-4 py-3 shadow-sm">
        <input
          placeholder="Search by patient, phone, or reason"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border rounded-lg p-8 text-center text-sm text-gray-500 shadow-sm"
            >
              No appointments found
            </motion.div>
          )}

          {filteredAppointments.map((appt) => {
            const status = statusConfig[appt.status];

            return (
              <motion.div
  key={appt.id}
  layout
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="bg-white border rounded-lg px-6 py-4 hover:bg-gray-50"
>
  {/* TOP ROW: Patient Info */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    {/* LEFT: Patient Info */}
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-medium text-gray-800">
        <User size={16} />
        {appt.patient?.name || "Unknown Patient"}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <CalendarDays size={14} />
          {new Date(appt.date).toLocaleString()}
        </div>

        {appt.patient?.phone && (
          <div className="flex items-center gap-1">
            <Phone size={14} />
            {appt.patient.phone}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Reason:</span>{" "}
        {appt.reason}
      </p>
    </div>

    {/* RIGHT: Status + Pending Buttons */}
    <div className="flex items-center gap-3 md:gap-4">
      {/* Status Badge */}
      <span
        className={`px-3 py-1 text-xs border rounded-full font-medium ${status.className}`}
      >
        {status.label}
      </span>

      {/* Pending Actions */}
      {appt.status === "PENDING" && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
            onClick={() => updateStatus(appt.id, "CONFIRMED")}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-rose-600 text-rose-700 hover:bg-rose-50"
            onClick={() => updateStatus(appt.id, "CANCELLED")}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  </div>

  {/* BOTTOM ROW: View Button */}
  <div className="mt-4 flex justify-end">
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
      onClick={() => router.push(`/doctor/appointments/${appt.id}`)}
    >
      <Eye size={16} />
      View
    </Button>
  </div>
</motion.div>

            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
