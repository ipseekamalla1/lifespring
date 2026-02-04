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
    firstName: string | null;
    lastName: string | null;
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
        a.patient?.firstName?.toLowerCase().includes(q) ||
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
  <div className="p-8 max-w-6xl mx-auto space-y-8 bg-white">

    {/* HEADER */}
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-black">
        Appointments
      </h1>
      <p className="text-sm text-green-700/80">
        Review and manage patient bookings
      </p>
    </motion.div>

    {/* FILTER BAR */}
    <div className="bg-white border border-green-200 rounded-2xl p-5 shadow-md space-y-4">
      {/* Search */}
      <input
        placeholder="Search by patient, phone, or reason"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-sm outline-none placeholder:text-green-700/50 text-green-900"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs rounded-full border transition font-medium
              ${
                filter === f
                  ? "bg-[#4ca626] text-white border-[#4ca626]"
                  : "bg-white text-green-700 border-green-200 hover:border-[#4ca626] hover:text-[#4ca626]"
              }`}
          >
            {f}
          </button>
        ))}

        {/* Date Range */}
        <div className="flex items-center gap-2 ml-auto">
          <CalendarDays size={16} className="text-green-600" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-green-200 rounded-md px-2 py-1 text-xs outline-none"
          />
          <span className="text-xs text-green-600">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-green-200 rounded-md px-2 py-1 text-xs outline-none"
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
            className="bg-white border border-green-200 rounded-2xl p-10 text-center text-sm text-green-700/70 shadow-md"
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
              className="bg-white border border-green-200 rounded-2xl px-6 py-5 shadow-md hover:shadow-xl transition"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div className="space-y-2">
                 <div className="flex items-center gap-2 font-medium text-green-900">
  <User size={16} />
  {`${appt.patient?.firstName || ""} ${appt.patient?.lastName || ""}`.trim() || "Unknown Patient"}
</div>


                  <div className="flex flex-wrap gap-4 text-xs text-green-700/70">
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

                  <p className="text-sm text-green-800">
                    <span className="font-medium">Reason:</span>{" "}
                    {appt.reason}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs border rounded-full font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>

                  {appt.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#4ca626] text-[#4ca626] hover:bg-green-50"
                        onClick={() =>
                          updateStatus(appt.id, "CONFIRMED")
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-500 text-rose-600 hover:bg-rose-50"
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
                  className="flex items-center gap-1 bg-[#4ca626] text-white hover:bg-green-50"
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
