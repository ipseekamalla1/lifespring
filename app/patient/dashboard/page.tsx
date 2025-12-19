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
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const profileRes = await fetch("/api/patient/profile", {
          credentials: "include",
        });

        if (!profileRes.ok) throw new Error();
        const profileData = await profileRes.json();
        setPatient(profileData);

        const appointmentsRes = await fetch(
          "/api/patient/appointments",
          { credentials: "include" }
        );

        const appointmentsData = await appointmentsRes.json();
        if (Array.isArray(appointmentsData)) {
          setAppointmentsCount(appointmentsData.length);
        }
      } catch {
        setError("Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{patient?.name ? `, ${patient.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your health records and appointments
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Status */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium text-lg">Profile</h3>

            {!isProfileComplete ? (
              <>
                <p className="text-sm text-yellow-600">
                  Profile incomplete
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
                <p className="text-sm text-green-600">
                  Profile completed
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

        {/* Doctors */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium text-lg">Doctors</h3>
            <p className="text-sm text-muted-foreground">
              Browse doctors and specializations
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/patient/doctors")}
            >
              View Doctors
            </Button>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium text-lg">Appointments</h3>

            <p className="text-sm text-muted-foreground">
              {appointmentsCount === 0
                ? "No appointments booked"
                : `You have ${appointmentsCount} appointment(s)`}
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => router.push("/patient/appointments")}
              >
                View Appointments
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/patient/doctors")}
              >
                Book New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
