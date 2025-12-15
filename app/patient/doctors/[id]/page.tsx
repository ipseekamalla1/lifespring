"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function DoctorDetails() {
  const { id } = useParams();
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

          <p className="text-xs text-muted-foreground pt-2">
            Appointment booking will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
