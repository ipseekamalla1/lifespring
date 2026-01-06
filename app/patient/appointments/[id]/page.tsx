"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

const statusStyle: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

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
  notes: {
    note: string;
    createdAt: string;
  }[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }[];
};

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [appointment, setAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `/api/patient/appointments/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Failed to load appointment");
        }

        const data = await res.json();
        setAppointment(data);
      } catch {
        setError("Unable to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground">
        Loading appointment details...
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-8 text-red-500">
        {error || "Appointment not found"}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* BACK */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-emerald-700"
      >
        <ArrowLeft size={18} />
        Back to Appointments
      </Button>

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">
            Appointment Details
          </h1>
          <p className="text-gray-600">
            {new Date(appointment.date).toLocaleString()}
          </p>
        </div>

        <Badge className={statusStyle[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      {/* DOCTOR INFO */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          Doctor Information
        </h2>
        <p className="font-medium">
          {appointment.doctor.name ?? "Doctor"}
        </p>
        <p className="text-sm text-gray-600">
          {appointment.doctor.specialization ?? "General"}
          {appointment.doctor.department?.name
            ? ` • ${appointment.doctor.department.name}`
            : ""}
        </p>
      </div>

      {/* REASON */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          Reason for Visit
        </h2>
        <p>{appointment.reason}</p>
      </div>

      {/* NOTES */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Doctor Notes
        </h2>

        {appointment.notes.length === 0 ? (
          <p className="text-muted-foreground">
            No notes available.
          </p>
        ) : (
          appointment.notes.map((n, i) => (
            <div
              key={i}
              className="border-l-4 border-emerald-500 pl-4 mb-3"
            >
              <p>{n.note}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* PRESCRIPTIONS */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Prescriptions
        </h2>

        {appointment.prescriptions.length === 0 ? (
          <p className="text-muted-foreground">
            No prescriptions issued.
          </p>
        ) : (
          <div className="space-y-3">
            {appointment.prescriptions.map((p, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 bg-gray-50"
              >
                <p className="font-semibold">
                  {p.medication}
                </p>
                <p className="text-sm">
                  {p.dosage} • {p.frequency}
                </p>
                {p.duration && (
                  <p className="text-sm">
                    Duration: {p.duration}
                  </p>
                )}
                {p.instructions && (
                  <p className="text-sm text-gray-600 mt-1">
                    {p.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
