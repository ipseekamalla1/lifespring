"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Stats = {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctor/me").then((r) => r.json()),
      fetch("/api/doctor/stats").then((r) => r.json()),
    ]).then(([doctorData, statsData]) => {
      setDoctor(doctorData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Hi, Dr. {doctor?.name ?? "Doctor"} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here’s an overview of your activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">
              {stats?.totalAppointments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today’s Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-blue-600">
              {stats?.todayAppointments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-yellow-600">
              {stats?.pendingAppointments}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => CANCELLED.push("/doctor/appointments")}>
            View Appointments
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/doctor/profile")}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
