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

const filters = ["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const;

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<typeof filters[number]>("ALL");

  // 🔹 Date range state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
    let data = appointments;

    // Status filter
    if (filter !== "ALL") {
      data = data.filter((a) => a.status === filter);
    }

    // Date range filter
    if (fromDate) {
      data = data.filter(
        (a) => new Date(a.date) >= new Date(fromDate)
      );
    }

    if (toDate) {
      data = data.filter(
        (a) =>
          new Date(a.date) <=
          new Date(`${toDate}T23:59:59`)
      );
    }

    // Search filter
    if (!search) return data;

    const q = search.toLowerCase();
    return data.filter(
      (a) =>
        a.patient?.name?.toLowerCase().includes(q) ||
        a.patient?.phone?.includes(q) ||
        a.reason.toLowerCase().includes(q)
    );
  }, [appointments, search, filter, fromDate, toDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-sm text-gray-500">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Appointments
        </h1>
        <p className="text-sm text-gray-500">
          Review and manage patient bookings
        </p>
      </motion.div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
        {/* Search */}
        <input
          placeholder="Search by patient, phone, or reason"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-gray-400"
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status */}
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-full border transition
                ${
                  filter === f
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
            >
              {f}
            </button>
          ))}

          {/* Date Range */}
          <div className="flex items-center gap-2 ml-auto">
            <CalendarDays size={16} className="text-gray-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-xs outline-none"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-md px-2 py-1 text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border rounded-xl p-10 text-center text-sm text-gray-500 shadow-sm"
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
                className="bg-white border rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
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
                      <span className="font-medium text-gray-700">
                        Reason:
                      </span>{" "}
                      {appt.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs border rounded-full font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>

                    {appt.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                          onClick={() =>
                            updateStatus(appt.id, "CONFIRMED")
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-600 text-rose-700 hover:bg-rose-50"
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

                <div className="mt-5 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    onClick={() =>
                      router.push(`/doctor/appointments/${appt.id}`)
                    }
                  >
                    <Eye size={16} />
                    View Details
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
