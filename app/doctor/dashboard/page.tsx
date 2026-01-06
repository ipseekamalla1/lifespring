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
  patient: { name: string | null };
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* DOCTOR PROFILE – FULL WIDTH */}
      {doctor && <DoctorProfileHero doctor={doctor} />}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Appointments"
          value={stats?.totalAppointments}
          icon={<CalendarCheck className="text-emerald-600" />}
        />
        <StatCard
          title="Today’s Appointments"
          value={stats?.todayAppointments}
          icon={<Clock className="text-emerald-600" />}
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingAppointments}
          icon={<UserRound className="text-emerald-600" />}
        />
      </div>

      {/* RECENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT APPOINTMENTS */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Appointments</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              onClick={() => router.push("/doctor/appointments")}
            >
              View all
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {appointments.length === 0 && (
              <p className="text-sm text-gray-500">No recent appointments</p>
            )}

            {appointments.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {a.patient?.name ?? "Unnamed Patient"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() =>
                    router.push(`/doctor/appointments/${a.id}`)
                  }
                >
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RECENT NOTES */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <FileText size={18} className="text-emerald-600" />
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {notes.length === 0 && (
              <p className="text-sm text-gray-500">No notes added yet</p>
            )}

            {notes.map(n => (
              <div
                key={n.id}
                className="border rounded-lg p-3 hover:bg-emerald-50 cursor-pointer"
                onClick={() =>
                  router.push(`/doctor/appointments/${n.appointmentId}`)
                }
              >
                <p className="text-sm font-medium">{n.patientName}</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {n.note}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value?: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-l-4 border-emerald-500">
      <CardHeader className="flex items-center gap-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold">{value ?? 0}</p>
      </CardContent>
    </Card>
  );
}
