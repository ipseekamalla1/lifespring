"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/me")
      .then((res) => res.json())
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Hi, Dr. {doctor?.name ?? "Doctor"} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here’s what’s happening today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today’s Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>View Patients</Button>
          <Button>Appointments</Button>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
