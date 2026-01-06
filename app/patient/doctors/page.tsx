"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Stethoscope, Building2, Clock } from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-sm text-muted-foreground">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Our Doctors</h1>
        <p className="text-sm text-muted-foreground">
          Choose a doctor and book your appointment
        </p>
      </div>

      {/* EMPTY STATE */}
      {doctors.length === 0 && (
        <div className="border rounded-xl p-8 text-center text-sm text-muted-foreground">
          No doctors are available at the moment.
        </div>
      )}

      {/* DOCTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            className="hover:shadow-lg transition-shadow border"
          >
            <CardContent className="p-5 space-y-4">
              {/* TOP */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-emerald-700" />
                </div>

                <div className="flex-1">
                  <p className="font-medium leading-tight">
                    {doc.name || "Doctor"}
                  </p>
                  <p className="text-sm text-emerald-700">
                    {doc.specialization || "General Physician"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-1 text-sm text-muted-foreground">
                {doc.department && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{doc.department}</span>
                  </div>
                )}

                {doc.experience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{doc.experience} years experience</span>
                  </div>
                )}
              </div>

              {/* ACTION */}
              <Button
                size="sm"
                className="w-full mt-2"
                onClick={() => router.push(`/patient/doctors/${doc.id}`)}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
