"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: string;
  experience?: number;
};

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading doctors...</p>;

  return (
    <div className="p-6 max-w-5xl space-y-4">
      <h1 className="text-xl font-semibold">Available Doctors</h1>

      {doctors.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No doctors available right now.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4 space-y-1">
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm">{doc.specialization}</p>
              <p className="text-xs text-muted-foreground">
                {doc.department} • {doc.experience} yrs experience
              </p>

              <Button
                size="sm"
                className="mt-2"
                variant="outline"
                onClick={() =>
                  router.push(`/patient/doctors/${doc.id}`)
                }
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
