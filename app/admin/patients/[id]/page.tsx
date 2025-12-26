"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, User } from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: string;
  doctor: {
    name: string;
    specialization: string;
    department: string;
    phone: string | null;
  };
};

export default function PatientProfilePage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/patients/${id}`)
      .then(res => res.json())
      .then(setPatient);
  }, [id]);

  if (!patient) {
    return <div className="p-10">Loading patient profile...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-emerald-50 to-white min-h-screen">

      {/* ================= PATIENT PROFILE CARD ================= */}
      <Card className="rounded-3xl shadow-xl">
        <CardContent className="p-8 grid md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={40} className="text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold mt-4">{patient.name}</h2>
            <Badge className="mt-2 bg-emerald-600">Patient</Badge>
          </div>

          {/* MIDDLE */}
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {patient.user.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> {patient.phone}
            </p>
            <p>Age: {patient.age ?? "-"}</p>
            <p>Gender: {patient.gender ?? "-"}</p>
          </div>

          {/* RIGHT */}
          <div>
            <p className="font-medium">Address</p>
            <p className="text-gray-600">{patient.address ?? "-"}</p>
          </div>

        </CardContent>
      </Card>

     {/* ================= APPOINTMENTS ================= */}
<div className="space-y-4">
  <h3 className="text-2xl font-bold">Appointments</h3>

  <Card className="rounded-2xl shadow">
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-emerald-100">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Reason</th>
            <th className="p-4 text-left">Doctor</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {patient.appointments?.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No appointments found
              </td>
            </tr>
          )}

          {patient.appointments?.map((a: Appointment) => (
            <tr
              key={a.id}
              className="border-t hover:bg-emerald-50 transition"
            >
              <td className="p-4">
                {new Date(a.date).toLocaleDateString()}
              </td>

              <td className="p-4">{a.reason}</td>

              <td className="p-4">
                <p className="font-medium">{a.doctor.name}</p>
                {a.doctor.phone && (
                  <p className="text-xs text-gray-500">
                    📞 {a.doctor.phone}
                  </p>
                )}
              </td>

              <td className="p-4">
                <p className="text-gray-700">{a.doctor.department}</p>
                <p className="text-xs text-gray-500">
                  {a.doctor.specialization}
                </p>
              </td>

              <td className="p-4 text-center">
                <Badge
                  className={
                    a.status === "CONFIRMED"
                      ? "bg-emerald-600"
                      : a.status === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }
                >
                  {a.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
</div>


    </div>
  );
}
