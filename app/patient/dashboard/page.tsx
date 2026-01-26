"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Stethoscope,
  ListChecks,
} from "lucide-react";

/* =======================
   TYPES
======================= */
type Patient = {
  firstName?: string;
  gender?: string;
};

type Appointment = {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  doctor: {
    name: string | null;
  };
};

/* =======================
   DATE HELPERS
======================= */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

/* =======================
   COMPONENT
======================= */
export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const profileRes = await fetch("/api/patient/profile");
      const profileData = await profileRes.json();
      setPatient(profileData);

      const appointmentsRes = await fetch("/api/patient/appointments");
      const appointmentsData = await appointmentsRes.json();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === "CONFIRMED");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">

      {/* ================= Header ================= */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-semibold text-green-900">
          Hello{patient?.firstName ? `, ${patient.firstName}` : ""}
        </h1>
        <p className="text-sm text-green-700 mt-1">
          {patient?.gender || ""}
        </p>
      </motion.div>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Appointments",
            value: appointments.length,
            icon: CalendarDays,
          },
          {
            label: "Doctors Consulted",
            value: new Set(
              appointments.map(a => a.doctor?.name).filter(Boolean)
            ).size,
            icon: Stethoscope,
          },
          {
            label: "Upcoming Appointments",
            value: upcoming.length,
            icon: ListChecks,
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-green-100 shadow-sm">
              <CardContent className="flex items-center justify-between py-5">
                <div>
                  <p className="text-sm text-green-600">{item.label}</p>
                  <p className="text-2xl font-semibold text-green-900">
                    {item.value}
                  </p>
                </div>
                <item.icon className="w-6 h-6 text-green-500" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ================= Appointments ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-green-900">
          Recent Appointments
        </h2>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 6).map(app => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-3">
                    {app.doctor?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(app.date)}
                  </td>
                  <td className="px-4 py-3">
                    {formatTime(app.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : app.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
