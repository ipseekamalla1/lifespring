"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

const statusStyle: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-[#4ca626]/15 text-[#4ca626]",
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

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="h-2 w-2 rounded-full bg-[#4ca626]" />
    <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
      {title}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-[#4ca626]/40 to-transparent" />
  </div>
);

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/patient/appointments/${id}`);
        if (!res.ok) throw new Error();
        setAppointment(await res.json());
      } catch {
        setError("Unable to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading appointment details...</div>;
  }

  if (error || !appointment) {
    return <div className="p-8 text-red-500">{error || "Appointment not found"}</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-gray-50/70">

      {/* BACK */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#4ca626] hover:bg-[#4ca626]/10"
      >
        <ArrowLeft size={18} />
        Back to Appointments
      </Button>

      {/* HEADER */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Appointment Details
          </h1>
          <p className="text-gray-600">
            {new Date(appointment.date).toLocaleString()}
          </p>
          <div className="mt-2 h-1 w-14 rounded-full bg-[#4ca626]" />
        </div>

        <Badge className={statusStyle[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      {/* DOCTOR INFO */}
      <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#4ca626] rounded-l-2xl" />
        <SectionHeader title="Doctor Information" />
        <p className="text-lg font-medium text-gray-900">
          {appointment.doctor.name ?? "Doctor"}
        </p>
        <p className="text-sm text-gray-600">
          {appointment.doctor.specialization ?? "General"}
          {appointment.doctor.department?.name &&
            ` • ${appointment.doctor.department.name}`}
        </p>
      </div>

      {/* REASON + NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* REASON */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200">
          <SectionHeader title="Reason for Visit" />
          <p className="text-gray-700 leading-relaxed">
            {appointment.reason}
          </p>
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200">
          <SectionHeader title="Doctor Notes" />

          {appointment.notes.length === 0 ? (
            <p className="text-gray-500">No notes available.</p>
          ) : (
            <div className="space-y-4">
              {appointment.notes.map((n, i) => (
                <div
                  key={i}
                  className="relative pl-5 py-3 bg-gray-50 rounded-lg"
                >
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#4ca626] rounded-l-lg" />
                  <p className="text-gray-700">{n.note}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRESCRIPTIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-200">
        <SectionHeader title="Prescriptions" />

        {appointment.prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions issued.</p>
        ) : (
          <div className="space-y-4">
            {appointment.prescriptions.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {p.medication}
                  </p>
                  <p className="text-sm text-gray-700">
                    {p.dosage} • {p.frequency}
                  </p>
                  {p.duration && (
                    <p className="text-sm text-gray-600">
                      Duration: {p.duration}
                    </p>
                  )}
                  {p.instructions && (
                    <p className="text-sm text-gray-600 mt-1">
                      {p.instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
