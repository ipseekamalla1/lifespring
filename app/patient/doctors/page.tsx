"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Building2,
  Clock,
  ChevronRight,
} from "lucide-react";

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
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-sm text-gray-500">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          Our Doctors
        </h1>
        <p className="text-gray-600">
          Choose a trusted specialist and book your appointment
        </p>
        <div className="h-1 w-14 bg-[#4ca626] rounded-full" />
      </div>

      {/* EMPTY */}
      {doctors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 bg-white">
          No doctors are available at the moment.
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* TOP ACCENT */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#4ca626]" />

            <CardContent className="p-6 space-y-6">
              {/* HEADER */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#4ca626]/15 flex items-center justify-center transition group-hover:bg-[#4ca626]">
                  <Stethoscope className="h-6 w-6 text-[#4ca626] group-hover:text-white transition" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 leading-tight">
                    {doc.name || "Doctor"}
                  </p>
                  <p className="text-sm text-[#4ca626]">
                    {doc.specialization || "General Physician"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm text-gray-600">
                {doc.department && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{doc.department}</span>
                  </div>
                )}

                {doc.experience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{doc.experience}+ years experience</span>
                  </div>
                )}
              </div>

              {/* ACTION */}
              <Button
                className="w-full flex items-center justify-center gap-2 bg-[#4ca626] hover:bg-[#449620] text-white transition"
                onClick={() =>
                  router.push(`/patient/doctors/${doc.id}`)
                }
              >
                View Profile
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
