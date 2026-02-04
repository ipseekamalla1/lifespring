"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Clock,
  FileText,
  UserRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type Stats = {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
};

type Appointment = {
  id: string;
  date: string;
  status: string;
  patient: { firstName: string | null };
};

type Note = {
  id: string;
  note: string;
  createdAt: string;
  appointmentId: string;
  patientName: string;
};

type DoctorProfile = {
  name: string;
  email: string;
  specialization: string;
  department: string;
  phone?: string;
  experience?: number;
};

/* ================= PAGE ================= */

export default function DoctorDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctor/stats").then(r => r.json()),
      fetch("/api/doctor/appointments").then(r => r.json()),
      fetch("/api/doctor/dashboard/notes").then(r => r.json()),
      fetch("/api/doctor/profile").then(r => r.json()),
    ]).then(([statsData, apptData, noteData, doctorData]) => {
      setStats(statsData);
      setAppointments(apptData);
      setNotes(noteData);
      setDoctor(doctorData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard…</div>;
  }

  return (
  <div className="space-y-10 p-6 min-h-screen bg-white max-w-7xl mx-auto">

    {/* HEADER */}
    <div>
      <h1 className="text-4xl font-bold text-black">
        Doctor Dashboard
      </h1>
      <p className="text-green-700/80 mt-1">
        Welcome back, Dr. {doctor?.name}
      </p>
    </div>

    {/* DOCTOR PROFILE */}
    {doctor && (
      <Card className="rounded-2xl border border-green-200 bg-white shadow-md">
        <CardContent className="p-8 flex flex-col md:flex-row md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-[#4ca626] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {doctor.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Dr. {doctor.name}
              </h2>
              <p className="text-green-700 font-medium">
                {doctor.specialization}
              </p>
              <p className="text-sm text-green-700/70">
                Department: {doctor.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <p><b>Email:</b> {doctor.email}</p>
            <p><b>Phone:</b> {doctor.phone ?? "—"}</p>
            <p><b>Experience:</b> {doctor.experience ? `${doctor.experience} years` : "—"}</p>
            <p>
              <b>Status:</b>{" "}
              <span className="text-green-800 font-semibold">Active</span>
            </p>
          </div>
        </CardContent>
      </Card>
    )}

    {/* STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      <DashboardStat
        title="Total Appointments"
        value={stats?.totalAppointments}
        icon={CalendarCheck}
      />
      <DashboardStat
        title="Today’s Appointments"
        value={stats?.todayAppointments}
        icon={Clock}
      />
      <DashboardStat
        title="Pending Requests"
        value={stats?.pendingAppointments}
        icon={UserRound}
      />
    </div>

    {/* RECENT SECTION */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* RECENT APPOINTMENTS */}
      <Card className="rounded-2xl border border-green-200 bg-white shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-800">
              Recent Appointments
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="border-[#4ca626] text-[#4ca626] hover:bg-green-50"
              onClick={() => router.push("/doctor/appointments")}
            >
              View all
            </Button>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 && (
              <p className="text-sm text-green-700/70">
                No recent appointments
              </p>
            )}

            {appointments.map(a => (
              <div
                key={a.id}
                className="flex justify-between items-center rounded-xl border border-green-100 p-4 hover:bg-green-50 transition"
              >
                <div>
                  <p className="font-medium text-green-900">
                    {a.patient?.firstName ?? "Unnamed Patient"}
                  </p>
                  <p className="text-xs text-green-700/70">
                    {new Date(a.date).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-[#4ca626] hover:bg-green-700"
                  onClick={() => router.push(`/doctor/appointments/${a.id}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RECENT NOTES */}
      <Card className="rounded-2xl border border-green-200 bg-white shadow-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Recent Notes
          </h2>

          <div className="space-y-4">
            {notes.length === 0 && (
              <p className="text-sm text-green-700/70">
                No notes added yet
              </p>
            )}

            {notes.map(n => (
              <div
                key={n.id}
                className="rounded-xl border border-green-100 p-4 hover:bg-green-50 cursor-pointer transition"
                onClick={() =>
                  router.push(`/doctor/appointments/${n.appointmentId}`)
                }
              >
                <p className="font-medium text-green-900">
                  {n.patientName}
                </p>
                <p className="text-sm text-green-700 line-clamp-2">
                  {n.note}
                </p>
                <p className="text-xs text-green-700/70 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
);

}

/* ================= DOCTOR PROFILE ================= */

function DoctorProfileHero({ doctor }: { doctor: DoctorProfile }) {
  return (
    <Card className="border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
              {doctor.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-900">
                Dr. {doctor.name}
              </h2>
              <p className="text-emerald-700 font-medium">
                {doctor.specialization}
              </p>
              <p className="text-sm text-gray-600">
                Department: {doctor.department}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <p><b>Email:</b> {doctor.email}</p>
            <p><b>Phone:</b> {doctor.phone ?? "—"}</p>
            <p>
              <b>Experience:</b>{" "}
              {doctor.experience ? `${doctor.experience} years` : "—"}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span className="text-emerald-700 font-semibold">Active</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ================= STAT CARD ================= */

function DashboardStat({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value?: number;
  icon: any;
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-green-200 bg-white shadow-md hover:shadow-xl transition">
      <div className="absolute inset-0 bg-gradient-to-r from-[#4ca626] to-green-700 opacity-[0.08]" />

      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-green-800/70">{title}</p>
          <h2 className="text-4xl font-bold text-green-900">
            {value ?? 0}
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#4ca626] to-green-700 text-white shadow-lg">
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );
}
