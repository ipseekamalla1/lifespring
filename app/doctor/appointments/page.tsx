"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/doctor/appointments")
      .then((res) => res.json())
      .then(setAppointments);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/doctor/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status:"CONFIRMED" }),
    });

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Appointments</h1>

      {appointments.map((a) => (
        <Card key={a.id}>
          <CardContent className="p-4 space-y-2">
            <p className="font-semibold">{a.patient.name}</p>
            <p className="text-sm text-gray-600">
              {new Date(a.date).toLocaleString()}
            </p>

            <p className="text-sm">
              Status: <b>{a.status}</b>
            </p>

            {a.status === "PENDING" && (
              <div className="flex gap-2">
                <Button onClick={() => updateStatus(a.id, "CONFIRMED")}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateStatus(a.id, "CANCELLED")}
                >
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
