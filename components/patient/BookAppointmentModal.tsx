"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Toast from "@/components/ui/Toast";

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;

type Doctor = {
  id: string;
  name: string;
};

export default function BookAppointmentModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showList, setShowList] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ---------------- LOAD DOCTORS ---------------- */
  useEffect(() => {
    fetch("/api/patient/doctors")
      .then(r => r.json())
      .then(setDoctors);
  }, []);

  /* ---------------- FETCH BOOKED SLOTS ---------------- */
  useEffect(() => {
    if (!selectedDoctor || !date) return;

    fetch(`/api/appointments/byDoctor?doctorId=${selectedDoctor.id}&date=${date}`)
      .then(r => r.json())
      .then(data => {
        const slots = data.map((a: any) =>
          new Date(a.date).toTimeString().slice(0, 5)
        );
        setBookedSlots(slots);
        setTime("");
      });
  }, [selectedDoctor, date]);

  /* ---------------- SLOTS ---------------- */
  const slotsWithStatus = useMemo(() => {
    const slots = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const t = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;

        slots.push({ time: t, booked: bookedSlots.includes(t) });
      }
    }
    return slots;
  }, [bookedSlots]);

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit() {
    if (!selectedDoctor || !date || !time || !reason) return;

    setLoading(true);

    const res = await fetch("/api/patient/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        date: `${date}T${time}:00`,
        reason,
      }),
    });

    if (!res.ok) {
      setToast({ message: "Slot already booked", type: "error" });
      setLoading(false);
      return;
    }

    setToast({ message: "Appointment booked successfully", type: "success" });
    setOpen(false);
    setDoctorSearch("");
    setSelectedDoctor(null);
    setDate("");
    setTime("");
    setReason("");
    onSuccess();
    setLoading(false);
  }

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            + Book Appointment
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* DOCTOR */}
            <div className="relative">
              <Label>Doctor</Label>
              <Input
                value={doctorSearch}
                onChange={e => {
                  setDoctorSearch(e.target.value);
                  setShowList(true);
                }}
              />

              {showList && (
                <Card className="absolute z-50 w-full mt-2">
                  {doctors
                    .filter(d =>
                      d.name.toLowerCase().includes(doctorSearch.toLowerCase())
                    )
                    .map(d => (
                      <div
                        key={d.id}
                        className="p-3 cursor-pointer hover:bg-emerald-50"
                        onClick={() => {
                          setDoctorSearch(d.name);
                          setSelectedDoctor(d);
                          setShowList(false);
                        }}
                      >
                        {d.name}
                      </div>
                    ))}
                </Card>
              )}
            </div>

            {/* DATE */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            {/* SLOTS */}
            {date && selectedDoctor && (
              <div>
                <Label>Available Slots</Label>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {slotsWithStatus.map(slot => (
                    <button
                      key={slot.time}
                      disabled={slot.booked}
                      onClick={() => !slot.booked && setTime(slot.time)}
                      className={`py-2 rounded border text-sm
                        ${
                          slot.booked
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : time === slot.time
                            ? "bg-emerald-600 text-white"
                            : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
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
              <Label>Reason</Label>
              <Input value={reason} onChange={e => setReason(e.target.value)} />
            </div>

            <Button
              disabled={!time || loading}
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
