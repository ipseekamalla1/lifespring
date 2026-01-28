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
import Toast from "@/components/ui/Toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;

type Doctor = {
  id: string;
  name: string;
};

export default function BookAppointmentModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* LOAD DOCTORS */
  useEffect(() => {
    fetch("/api/patient/doctors")
      .then((r) => r.json())
      .then(setDoctors);
  }, []);

  /* FETCH BOOKED SLOTS */
  useEffect(() => {
    if (!selectedDoctor || !date) return;

    fetch(
      `/api/appointments/byDoctor?doctorId=${selectedDoctor.id}&date=${date}`
    )
      .then((r) => r.json())
      .then((data) => {
        const slots = data.map((a: any) =>
          new Date(a.date).toTimeString().slice(0, 5)
        );
        setBookedSlots(slots);
        setTime("");
      });
  }, [selectedDoctor, date]);

  /* TIME SLOTS */
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

  /* SUBMIT */
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

    const data = await res.json();

setToast({
  message: "Appointment booked successfully",
  type: "success",
});

setOpen(false);
setSelectedDoctor(null);
setDate("");
setTime("");
setReason("");
onSuccess();

// ✅ OPEN PDF IN NEW TAB USING RETURNED ID
window.open(
  `/api/appointments/${data.id}/pdf`,
  "_blank"
);

setLoading(false);

    setLoading(false);
  }

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#4ca626] hover:bg-emerald-700">
            + Book Appointment
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* DOCTOR */}
            <div>
              <Label>Doctor</Label>
              <Select
                value={selectedDoctor?.id || ""}
                onValueChange={(value) => {
                  const doc = doctors.find((d) => d.id === value) || null;
                  setSelectedDoctor(doc);
                  setDate("");
                  setTime("");
                }}
              >
                <SelectTrigger className="mt-2 h-11 border-emerald-300">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DATE */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* SLOTS */}
            {date && selectedDoctor && (
              <div>
                <Label>Available Slots</Label>
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {slotsWithStatus.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.booked}
                      onClick={() => setTime(slot.time)}
                      className={`py-2 rounded border text-sm ${
                        slot.booked
                          ? "bg-gray-200 text-gray-400"
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
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button
              disabled={!time || loading}
              onClick={handleSubmit}
              className="w-full bg-emerald-600"
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
