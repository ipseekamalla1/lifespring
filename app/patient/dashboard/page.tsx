"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User2,
  Clock,
  CalendarDays,
  Stethoscope,
  ListChecks,
} from "lucide-react";

type Patient = {
  name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
};

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

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
      const data = await appointmentsRes.json();
      setAppointments(Array.isArray(data) ? data : []);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500">Loading Dashboard...</div>
    );

  const upcoming = appointments.filter(a => a.status === "Scheduled");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ======== Hero Header ======== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">
              Hello, {patient?.name || "Patient"} 👋
            </h1>
            <p className="text-sm text-green-600">
              Welcome back to your dashboard
            </p>
          </div>
          <div className="bg-green-200 p-2 rounded-full shadow-md">
            <User2 className="w-10 h-10 text-green-800" />
          </div>
        </div>
      </motion.div>

      {/* ======== Stats Cards ======== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border border-green-200 hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4">
              <CalendarDays className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-lg font-semibold text-green-800">
                  {appointments.length}
                </p>
                <p className="text-sm text-green-600">Total Appointments</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border border-green-200 hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4">
              <Stethoscope className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-lg font-semibold text-green-800">
                  {Array.from(new Set(appointments.map(a => a.doctorName))).length}
                </p>
                <p className="text-sm text-green-600">Doctors Visited</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border border-green-200 hover:shadow-xl transition">
            <CardContent className="flex items-center gap-4">
              <ListChecks className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-lg font-semibold text-green-800">
                  {upcoming.length}
                </p>
                <p className="text-sm text-green-600">Upcoming</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ======== Quick Actions ======== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-4 flex-wrap">
          <Button variant="default" onClick={() => router.push("/patient/profile")}>
            View Profile
          </Button>
          <Button variant="outline" onClick={() => router.push("/patient/doctors")}>
            Find Doctors
          </Button>
          <Button variant="outline" onClick={() => router.push("/patient/appointments")}>
            My Appointments
          </Button>
        </div>
      </motion.div>

      {/* ======== Recent Appointments Table ======== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-green-900">
          Recent Appointments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-green-800">
            <thead className="text-green-600 uppercase bg-green-50">
              <tr>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(-6).reverse().map(app => (
                <tr key={app.id} className="border-b">
                  <td className="px-4 py-2">{app.doctorName}</td>
                  <td className="px-4 py-2">{app.date}</td>
                  <td className="px-4 py-2">{app.time}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
