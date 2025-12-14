import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Stethoscope, User } from "lucide-react";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Manage everything from here.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View and update your personal information.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Stethoscope className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Doctors</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Browse available doctors and specializations.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View and manage your appointments.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
