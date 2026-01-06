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

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;

type Doctor = {
  id: string;
  name: string;
  specialty?: string;
};

type Props = {
  onSuccess: () => void;
};

export default function BookAppointmentModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showList, setShowList] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  /* LOAD DATA */
  useEffect(() => {
    fetch("/api/patient/doctors").then(r => r.json()).then(setDoctors);
    fetch("/api/patient/appointments").then(r => r.json()).then(setAppointments);
  }, []);

  /* SLOT LOGIC (same as admin) */
  const availableSlots = useMemo(() => {
    if (!date || !selectedDoctor) return [];

    const booked = appointments
      .filter(
        a =>
          a.doctor.id === selectedDoctor.id &&
          a.date.split("T")[0] === date &&
          a.status !== "CANCELLED"
      )
      .map(a => new Date(a.date).toTimeString().slice(0, 5));

    const slots: string[] = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const slot = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        if (!booked.includes(slot)) slots.push(slot);
      }
    }
    return slots;
  }, [date, selectedDoctor, appointments]);

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  async function handleSubmit() {
    if (!selectedDoctor || !date || !time || !reason) return;

    setLoading(true);

    const res = await fetch("/api/patient/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        doctorId: selectedDoctor.id,
        date: `${date}T${time}:00`,
        reason,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Slot already booked");
      setLoading(false);
      return;
    }

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          + Book Appointment
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* DOCTOR SEARCH */}
          <div className="relative">
            <Label>Doctor</Label>
            <Input
              value={doctorSearch}
              placeholder="Type doctor name"
              onChange={e => {
                setDoctorSearch(e.target.value);
                setShowList(true);
              }}
              onFocus={() => setShowList(true)}
            />

            {showList && filteredDoctors.length > 0 && (
              <Card className="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto">
                {filteredDoctors.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setDoctorSearch(doc.name);
                      setSelectedDoctor(doc);
                      setShowList(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  >
                    <div className="font-medium">{doc.name}</div>
                    {doc.specialty && (
                      <div className="text-xs text-gray-500">{doc.specialty}</div>
                    )}
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
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {availableSlots.length === 0 && (
                  <p className="col-span-4 text-sm text-red-500">
                    No slots available
                  </p>
                )}
                {availableSlots.map(slot => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`py-1 rounded-lg text-sm border
                      ${time === slot
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-700"}
                    `}
                  >
                    {slot}
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
              placeholder="Reason for visit"
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !time}
            className="w-full"
          >
            {loading ? "Booking..." : "Confirm Appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
