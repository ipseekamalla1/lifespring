"use client";

import { useEffect, useState } from "react";
import BookAppointment from "./BookAppointment";

interface Appointment {
  id: string;
  date: string;
  reason: string;
  status: string;
  doctor: {
    name: string;
    specialization: string;
  };
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await fetch("/api/patient/appointments");
   const data = await res.json();

if (Array.isArray(data)) {
  setAppointments(data);
} else {
  setAppointments([]);
}

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id: string) => {
    await fetch(`/api/patient/appointments/${id}`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchAppointments();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {loading && <p>Loading...</p>}

      {!loading && appointments.length === 0 && (
        <p>No appointments found</p>
      )}

      {appointments.map((a) => (
        <div key={a.id} className="border p-4 mb-3 rounded">
          <p><b>Doctor:</b> {a.doctor.name}</p>
          <p><b>Specialization:</b> {a.doctor.specialization}</p>
          <p><b>Date:</b> {new Date(a.date).toLocaleString()}</p>
          <p><b>Reason:</b> {a.reason}</p>
          <p><b>Status:</b> {a.status}</p>

          {a.status !== "CANCELLED" && (
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => cancelAppointment(a.id)}
            >
              Cancel
            </button>
          )}
        </div>
      ))}

      <BookAppointment onBooked={fetchAppointments} />
    </div>
  );
}
