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
      setPatient(await profileRes.json());

      const appointmentsRes = await fetch("/api/patient/appointments");
      const data = await appointmentsRes.json();
      setAppointments(Array.isArray(data) ? data : []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === "CONFIRMED");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 bg-gray-50/50">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-semibold text-gray-900">
          Hello{patient?.firstName ? `, ${patient.firstName}` : ""}
        </h1>
        {patient?.gender && (
          <p className="text-sm text-gray-500">
            {patient.gender}
          </p>
        )}
        <div className="h-1 w-14 rounded-full bg-[#4ca626]" />
      </motion.div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Appointments", value: appointments.length, icon: CalendarDays },
          {
            label: "Doctors Consulted",
            value: new Set(appointments.map(a => a.doctor?.name).filter(Boolean)).size,
            icon: Stethoscope,
          },
          { label: "Upcoming Appointments", value: upcoming.length, icon: ListChecks },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#4ca626] rounded-l-xl" />
              <CardContent className="flex items-center justify-between py-6 pl-6">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
                <item.icon className="w-6 h-6 text-[#4ca626]" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ================= RECENT APPOINTMENTS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Appointments
          </h2>

          <Button
            size="sm"
            variant="outline"
            className="border-[#4ca626] text-[#4ca626] hover:bg-[#4ca626]/10"
            onClick={() => router.push("/patient/appointments")}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#4ca626] border-b border-[#4ca626]/20">
              <tr>
                {["Doctor", "Date", "Time", "Status"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 font-medium text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {appointments.slice(0, 6).map(app => (
                <tr
                  key={app.id}
                  className="border-t hover:bg-gray-50 transition"
                >
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
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "CONFIRMED"
                          ? "bg-[#4ca626]/15 text-[#4ca626]"
                          : app.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
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
