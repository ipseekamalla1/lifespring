"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Stethoscope,
  Clock,
  Phone,
  CalendarDays,
} from "lucide-react";
import Toast from "@/components/ui/Toast";

/* ---------------- CONFIG ---------------- */
const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;

/* ---------------- TYPES ---------------- */
type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: { name: string };
  experience?: number;
  phone?: string;
};

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ---------------- LOAD DOCTOR ---------------- */
  useEffect(() => {
    fetch(`/api/patient/doctors/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setDoctor)
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------------- FETCH BOOKED SLOTS ---------------- */
  useEffect(() => {
    if (!date) return;

    fetch(`/api/appointments/byDoctor?doctorId=${id}&date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(
          data.map((a: any) =>
            new Date(a.date).toTimeString().slice(0, 5)
          )
        );
        setTime("");
      });
  }, [date, id]);

  /* ---------------- SLOTS ---------------- */
  const slots = useMemo(() => {
    const list: { time: string; booked: boolean }[] = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const t = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        list.push({ time: t, booked: bookedSlots.includes(t) });
      }
    }
    return list;
  }, [bookedSlots]);

  /* ---------------- BOOK ---------------- */
  async function bookAppointment() {
    if (!date || !time || !reason.trim()) {
      setToast({ message: "Please fill all fields", type: "error" });
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/patient/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        doctorId: id,
        date: `${date}T${time}:00`,
        reason,
      }),
    });

    if (!res.ok) {
      setToast({ message: "Slot already booked", type: "error" });
      setSubmitting(false);
      return;
    }

    setToast({ message: "Appointment booked", type: "success" });
    setTimeout(() => router.push("/patient/appointments"), 1200);
  }

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!doctor) return <p className="p-6 text-center">Doctor not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ---------------- DOCTOR HERO CARD ---------------- */}
      <Card className="shadow-sm border rounded-2xl">
        <CardContent className="p-8 flex flex-col md:flex-row gap-8">
          <div className="h-28 w-28 rounded-full bg-[#4ca626]/15 flex items-center justify-center shrink-0">
            <Stethoscope className="h-12 w-12 text-[#4ca626]" />
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-3xl font-semibold">Dr. {doctor.name}</h1>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ca626]/10 text-[#4ca626] text-sm font-medium">
              {doctor.specialization || "General Physician"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 pt-4">
              {doctor.department?.name && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#4ca626]" />
                  {doctor.department.name}
                </div>
              )}
              {doctor.experience !== undefined && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4ca626]" />
                  {doctor.experience} years experience
                </div>
              )}
              {doctor.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#4ca626]" />
                  {doctor.phone}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- BOOKING SECTION ---------------- */}
      <Card className="shadow-sm border rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#4ca626]" />
            <h2 className="text-xl font-semibold">Book Appointment</h2>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm font-medium">Select Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
            />
          </div>

          {/* SLOTS */}
          {date && (
            <div>
              <label className="text-sm font-medium">Available Time</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={slot.booked}
                    onClick={() => setTime(slot.time)}
                    className={`py-2 rounded-lg text-sm font-medium transition
                      ${
                        slot.booked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : time === slot.time
                          ? "bg-[#4ca626] text-white"
                          : "border border-[#4ca626] text-[#4ca626] hover:bg-[#4ca626]/10"
                      }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REASON */}
          <div>
            <label className="text-sm font-medium">Reason</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your concern"
              className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
            />
          </div>

          <Button
            onClick={bookAppointment}
            disabled={!time || submitting}
            className="w-full bg-[#4ca626] hover:bg-[#3f8f1f] rounded-lg text-base"
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
