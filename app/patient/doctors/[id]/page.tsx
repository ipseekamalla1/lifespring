"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Stethoscope, Clock, Phone } from "lucide-react";
import Toast from "@/components/ui/Toast";

type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: {
    name: string;
  };
  experience?: number;
  phone?: string;
};

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ---------------- LOAD DOCTOR ---------------- */
  useEffect(() => {
    async function loadDoctor() {
      try {
        const res = await fetch(`/api/patient/doctors/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load doctor");

        const data = await res.json();
        setDoctor(data);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [id]);

  /* ---------------- DATE VALIDATION ---------------- */
  const minDateTime = new Date().toISOString().slice(0, 16);

  /* ---------------- BOOK APPOINTMENT ---------------- */
  async function bookAppointment() {
    if (!date || !reason.trim()) {
      setToast({
        message: "Please select date and enter reason",
        type: "error",
      });
      return;
    }

    if (new Date(date) < new Date()) {
      setToast({
        message: "You cannot book an appointment in the past",
        type: "error",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          doctorId: id,
          date,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setToast({
        message: "Appointment booked successfully",
        type: "success",
      });

      setTimeout(() => {
        router.push("/patient/appointments");
      }, 1200);
    } catch (err: any) {
      setToast({
        message: err.message || "Failed to book appointment",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return <p className="p-6 text-center">Loading doctor details...</p>;
  }

  if (!doctor) {
    return <p className="p-6 text-center">Doctor not found</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* DOCTOR CARD */}
      <Card className="shadow-md border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Stethoscope className="h-10 w-10 text-emerald-700" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-semibold">{doctor.name}</h1>

              <p className="text-emerald-700 font-medium">
                {doctor.specialization || "General Physician"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground mt-3">
                {doctor.department?.name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {doctor.department.name}
                  </div>
                )}

                {doctor.experience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {doctor.experience} years experience
                  </div>
                )}

                {doctor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {doctor.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOOKING FORM */}
      <Card className="shadow-md border">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Book Appointment</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date & Time</label>
            <input
              type="datetime-local"
              min={minDateTime}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Visit</label>
            <textarea
              placeholder="Describe your symptoms or reason"
              className="border rounded-lg p-2 w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={bookAppointment}
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
