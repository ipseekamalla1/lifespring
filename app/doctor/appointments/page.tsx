"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  patient?: {
    name?: string;
    phone?: string;
    gender?: string;
    age?: number;
  };
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/doctor/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/doctor/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status } : appt
      )
    );
  };

  if (loading) {
    return <p className="p-6">Loading appointments...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Appointments</h1>

      {appointments.length === 0 && (
        <p>No appointments found.</p>
      )}

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border p-4 rounded-lg"
          >
            <p>
              <strong>Patient:</strong>{" "}
              {appointment.patient?.name ?? "N/A"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {appointment.patient?.phone ?? "N/A"}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {appointment.patient?.gender ?? "N/A"}
            </p>

            <p>
              <strong>Age:</strong>{" "}
              {appointment.patient?.age ?? "N/A"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.date).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong> {appointment.time}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize">{appointment.status}</span>
            </p>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={() =>
                  updateStatus(appointment.id, "CONFIRMED")
                }
                disabled={appointment.status === "CONFIRMED"}
              >
                Confirm
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  updateStatus(appointment.id, "CANCELLED")
                }
                disabled={appointment.status === "CANCELLED"}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
