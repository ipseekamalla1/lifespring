"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/patient/doctors/${id}`)
      .then((res) => res.json())
      .then(setDoctor);
  }, [id]);

  if (!doctor) return <p className="p-6">Loading doctor details...</p>;

  return (
    <div className="p-6 max-w-3xl">
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-xl font-semibold">{doctor.name}</h2>
          <p>{doctor.specialization}</p>
          <p className="text-sm text-muted-foreground">
            {doctor.department}
          </p>
          <p className="text-sm">
            Experience: {doctor.experience} years
          </p>
          <p className="text-sm">Phone: {doctor.phone}</p>

          {/* ✅ NEW BUTTON */}
          <Button
            className="mt-4"
            onClick={() =>
              router.push(`/patient/appointments/new?doctorId=${doctor.id}`)
            }
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
