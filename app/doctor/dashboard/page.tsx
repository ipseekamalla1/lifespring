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

export default function DoctorDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctor/stats").then(r => r.json()),
      fetch("/api/doctor/appointments").then(r => r.json()),
      fetch("/api/doctor/dashboard/notes").then(r => r.json()),
    ]).then(([statsData, apptData, noteData]) => {
      setStats(statsData);
      setAppointments(apptData);
      setNotes(noteData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard…</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">
          Doctor Dashboard
        </h1>
        <p className="text-sm text-emerald-700">
          Overview of your recent activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Appointments"
          value={stats?.totalAppointments}
          icon={<CalendarCheck />}
        />
        <StatCard
          title="Today’s Appointments"
          value={stats?.todayAppointments}
          icon={<Clock />}
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingAppointments}
          icon={<UserRound />}
        />
      </div>

      {/* RECENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT APPOINTMENTS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Appointments</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/doctor/appointments")}
            >
              View all
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {appointments.length === 0 && (
              <p className="text-sm text-gray-500">
                No recent appointments
              </p>
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
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText size={18} />
            <CardTitle>Recent Notes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {notes.length === 0 && (
              <p className="text-sm text-gray-500">
                No notes added yet
              </p>
            )}

            {notes.map(n => (
              <div
                key={n.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  router.push(`/doctor/appointments/${n.appointmentId}`)
                }
              >
                <p className="text-sm font-medium">
                  {n.patientName}
                </p>
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

/* SMALL STAT CARD */
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
      <CardHeader className="flex flex-row items-center gap-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold">{value ?? 0}</p>
      </CardContent>
    </Card>
  );
}
