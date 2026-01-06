"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookAppointmentModal from "@/components/patient/BookAppointmentModal";



type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
  doctor: {
    name: string | null;
    specialization: string | null;
    department: {
      name: string;
    } | null;
  };
};

const statusStyle: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/patient/appointments", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        setError("Unable to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const now = new Date();

  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now
  );

  const past = appointments.filter(
    (a) => new Date(a.date) < now
  );

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-emerald-800">
      My Appointments
    </h1>
    <p className="text-gray-600 mt-1">
      View your upcoming and past medical appointments
    </p>
  </div>

  <BookAppointmentModal
    onSuccess={() => {
      setLoading(true);
      fetch("/api/patient/appointments", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .finally(() => setLoading(false));
    }}
  />
</div>


      {/* UPCOMING */}
      <section>
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          Upcoming Appointments
        </h2>

        {upcoming.length === 0 && (
          <p className="text-muted-foreground">
            No upcoming appointments.
          </p>
        )}

        <div className="grid gap-4">
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border bg-white p-6 shadow-sm flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-emerald-800">
                  {a.doctor.name ?? "Doctor"}
                </p>

                <p className="text-sm text-gray-600">
                  {a.doctor.specialization ?? "General"}{" "}
                  {a.doctor.department?.name
                    ? `• ${a.doctor.department.name}`
                    : ""}
                </p>

                <p className="text-sm">
                  📅 {new Date(a.date).toLocaleString()}
                </p>

                <p className="text-sm">
                  <span className="font-medium">Reason:</span>{" "}
                  {a.reason}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge className={statusStyle[a.status]}>
                  {a.status}
                </Badge>

                <Link href={`/patient/appointments/${a.id}`}>
  <Button variant="outline" size="sm" className="bg-emerald-700 text-white">
    View Details
  </Button>
</Link>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORY */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Appointment History
        </h2>

        <div className="space-y-3">
          {past.map((a) => (
            <div
              key={a.id}
              className="rounded-lg border bg-gray-50 p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {a.doctor.name ?? "Doctor"}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(a.date).toLocaleDateString()} — {a.reason}
                </p>
              </div>

              <Badge className={statusStyle[a.status]}>
                {a.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
