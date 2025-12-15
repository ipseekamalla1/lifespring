"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Patient = {
  name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
};

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/patient/profile");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPatient(data);
      } catch {
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const isProfileComplete =
    patient?.name &&
    patient?.age &&
    patient?.gender &&
    patient?.phone &&
    patient?.address;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {/* Welcome Card */}
        <Card>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-xl font-semibold">
              Welcome{patient?.name ? `, ${patient.name}` : ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your profile and explore available doctors.
            </p>
          </CardContent>
        </Card>

        {/* Profile Status Card */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium">Profile Status</h3>

            {!isProfileComplete ? (
              <>
                <p className="text-yellow-600 text-sm">
                  Your profile is incomplete.
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push("/patient/profile")}
                >
                  Complete Profile
                </Button>
              </>
            ) : (
              <>
                <p className="text-green-600 text-sm">
                  Your profile is complete.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/patient/profile")}
                >
                  View Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Doctors Card */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium">Doctors</h3>
            <p className="text-sm text-muted-foreground">
              Browse doctors by specialization and experience.
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/patient/doctors")}
            >
              View Doctors
            </Button>
          </CardContent>
        </Card>

        {/* Appointments Card (Empty State) */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium">Appointments</h3>
            <p className="text-sm text-muted-foreground">
              You have no appointments yet.
            </p>
            <Button size="sm" variant="outline" disabled>
              Booking coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
