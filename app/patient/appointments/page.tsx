"use client";

import { useEffect, useState } from "react";
import BookAppointment from "./BookAppointment";

interface Appointment {
  id: string;
  date: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  doctor: {
    name: string;
    specialization: string;
  };
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/patient/appointments", {
        credentials: "include",
      });

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id: string) => {
    setCancellingId(id);

    await fetch(`/api/patient/appointments/${id}`, {
      method: "PATCH",
      credentials: "include",
    });

    setCancellingId(null);
    fetchAppointments();
  };

  const statusColor = (status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "CONFIRMED") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-600";
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

          <span
            className={`inline-block mt-1 px-2 py-1 rounded text-sm ${statusColor(
              a.status
            )}`}
          >
            {a.status}
          </span>

          {a.status !== "CANCELLED" && (
            <button
              disabled={cancellingId === a.id}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
              onClick={() => cancelAppointment(a.id)}
            >
              {cancellingId === a.id ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      ))}

      <BookAppointment onBooked={fetchAppointments} />
    </div>
  );
}
