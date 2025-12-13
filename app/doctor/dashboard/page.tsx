"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch("/api/doctor/me");
      const data = await res.json();
      setDoctor(data);
      setLoading(false);
    };

    fetchDoctor();
  }, []);

  if (loading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">
  Hi, Dr. {doctor?.name ?? doctor?.email?.split("@")[0]} 👋
</h1>


      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold">Total Patients</h2>
            <p className="text-4xl font-semibold mt-2">{doctor?.patientCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold">Today's Appointments</h2>
            <p className="text-4xl font-semibold mt-2">{doctor?.todayAppointments || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold">Pending Reports</h2>
            <p className="text-4xl font-semibold mt-2">3</p>
          </CardContent>
        </Card>
      </div>

      {/* UPCOMING APPOINTMENTS */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>

          {doctor?.appointments?.length === 0 ? (
            <p>No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {doctor?.appointments?.map((appt: any) => (
                <div
                  key={appt.id}
                  className="border p-3 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-gray-600">{appt.time}</p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

          <div className="flex flex-wrap gap-3">
            <Button>Add Patient Notes</Button>
            <Button>View My Patients</Button>
            <Button>Medical Reports</Button>
            <Button variant="outline">Profile Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}