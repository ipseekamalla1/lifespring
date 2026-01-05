"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
  patient: {
    name: string | null;
    phone: string | null;
  };
  doctor: {
    name: string | null;
    department: {
      name: string;
    } | null;
  };
};

/* ================= STYLES ================= */

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

/* ================= COMPONENT ================= */

export default function AdminAppointments() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchAppointments();
  };

  const filteredAppointments = useMemo(() => {
    let data = [...appointments];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        a =>
          a.patient?.name?.toLowerCase().includes(q) ||
          a.patient?.phone?.includes(q) ||
          a.doctor?.name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter(a => a.status === statusFilter);
    }

    data.sort((a, b) =>
      sortOrder === "DESC"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return data;
  }, [appointments, search, statusFilter, sortOrder]);

  if (loading) {
    return <div className="p-8 text-emerald-700">Loading appointments…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">
            Appointments Management
          </h1>
          <p className="text-sm text-emerald-700">
            Admin view for managing appointments
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/appointments/new")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          + Add Appointment
        </button>
      </motion.div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Search patient / phone / doctor"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as "ASC" | "DESC")}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="DESC">Latest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map(appt => (
              <tr key={appt.id} className="border-b hover:bg-emerald-50">
                <td className="px-4 py-3 text-sm">
                  {new Date(appt.date).toLocaleString()}
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">
                    {appt.patient?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appt.patient?.phone || ""}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">
                    {appt.doctor?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appt.doctor?.department?.name || "—"}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm">{appt.reason}</td>

                <td className="px-4 py-3 text-sm">
                  <select
                    value={appt.status}
                    onChange={e =>
                      updateStatus(
                        appt.id,
                        e.target.value as AppointmentStatus
                      )
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${statusStyles[appt.status]}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
