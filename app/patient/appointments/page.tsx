"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PatientAppointments() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">Appointments</h1>

      <Card>
        <CardContent className="p-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            You don’t have any appointments yet.
          </p>

          <p className="text-xs text-muted-foreground">
            Appointment booking will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
