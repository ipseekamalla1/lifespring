"use client";

import { useEffect, useState } from "react";

export default function BookAppointment({
  onBooked,
}: {
  onBooked: () => void;
}) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetch("/api/patient/doctors")
      .then((res) => res.json())
      .then(setDoctors);
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/patient/appointments", {
      method: "POST",
       credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, date, reason }),
    });

    setDoctorId("");
    setDate("");
    setReason("");
    onBooked();
  };

  return (
    <form onSubmit={submit} className="mt-6 border p-4 rounded">
      <h2 className="font-bold mb-2">Book Appointment</h2>

      <select
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        required
      >
        <option value="">Select Doctor</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.specialization})
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />

      <button className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">
        Book
      </button>
    </form>
  );
}
