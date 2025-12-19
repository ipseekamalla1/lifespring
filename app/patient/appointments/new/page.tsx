"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Doctor = {
  id: string;
  name: string;
};

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorIdFromQuery = searchParams.get("doctorId");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(
    doctorIdFromQuery
  );
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch doctors list
  useEffect(() => {
    fetch("/api/patient/doctors")
      .then((res) => res.json())
      .then(setDoctors);
  }, []);

  async function handleSubmit() {
    if (!doctorId || !date || !reason) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/patient/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        date,
        reason,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to book appointment");
      return;
    }

    router.push("/patient/appointments");
  }

  return (
    <div className="p-6 max-w-3xl">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Book Appointment</h1>

          {/* Doctor */}
          <div>
            <label className="text-sm">Doctor</label>
            <select
              className="w-full border rounded p-2 mt-1"
              value={doctorId ?? ""}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">Select doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm">Date</label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your issue..."
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Booking..." : "Confirm Appointment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
