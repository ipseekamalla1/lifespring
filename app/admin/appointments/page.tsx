"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  patient: {
    name: string | null;
    phone: string | null;
  };
  doctor: {
    name: string | null;
    department: string | null;
  };
};

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) {
        setAppointments([]);
        return;
      }
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  if (loading) {
    return (
      <div className="p-8 text-emerald-700 font-medium">
        Loading appointments…
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-emerald-900">
          Appointments Management
        </h1>
        <p className="text-sm text-emerald-700 mt-1">
          View, monitor, and manage all patient appointments in real time.
        </p>
      </motion.div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-emerald-600 to-green-500 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Patient</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Doctor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Reason</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-emerald-700"
                >
                  No appointments found.
                </td>
              </tr>
            )}

            {appointments.map((appt, index) => (
              <motion.tr
                key={appt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-b last:border-none hover:bg-emerald-50 transition"
              >
                {/* Date */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(appt.date).toLocaleString()}
                </td>

                {/* Patient */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {appt.patient?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appt.patient?.phone || ""}
                  </div>
                </td>

                {/* Doctor */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">
                    {appt.doctor?.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appt.doctor?.department || ""}
                  </div>
                </td>

                {/* Reason */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  {appt.reason}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[appt.status]}`}
                    >
                      {appt.status}
                    </span>

                    <select
                      value={appt.status}
                      onChange={(e) =>
                        updateStatus(appt.id, e.target.value)
                      }
                      className="
                        ml-2 rounded-md border border-emerald-300 
                        bg-white px-2 py-1 text-xs
                        focus:outline-none focus:ring-2 focus:ring-emerald-400
                      "
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
