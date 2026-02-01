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
    department: string | null;
    phone: string | null;
  };
};

export default function PatientProfilePage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/patients/${id}`)
      .then((res) => res.json())
      .then(setPatient);
  }, [id]);

  if (!patient) {
    return <div className="p-10">Loading patient profile...</div>;
  }

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
  ) => {
    try {
      setUpdatingId(appointmentId);

      const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed");

      const updated = await res.json();

      setPatient((prev: any) => ({
        ...prev,
        appointments: prev.appointments.map((a: Appointment) =>
          a.id === updated.id ? { ...a, status: updated.status } : a
        ),
      }));
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate age from dateOfBirth
  const calculateAge = (dob: string | null) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Format blood group
  const formatBloodGroup = (bg: string | null) => {
    if (!bg) return "-";
    return bg.replace("_POS", "+").replace("_NEG", "-");
  };

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      {/* ================= PATIENT PROFILE CARD ================= */}
      <Card className="rounded-2xl shadow-sm border border-gray-200">
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 rounded-full bg-[#4ca626]/20 flex items-center justify-center">
              <User size={40} className="text-[#4ca626]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#4ca626] mt-4">
              {patient.firstName} {patient.lastName ?? ""}
            </h2>
            <Badge className="mt-2 bg-[#4ca626]/20 text-[#4ca626]">Patient</Badge>
          </div>

          {/* MIDDLE */}
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <Mail size={16} /> {patient.user?.email ?? "-"}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} /> {patient.phone ?? "-"}
            </p>
            <p>Age: {calculateAge(patient.dateOfBirth)}</p>
            <p>Gender: {patient.gender ?? "-"}</p>
            <p>Blood Group: {formatBloodGroup(patient.bloodGroup)}</p>
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
        <h3 className="text-2xl font-semibold text-[#4ca626]">Appointments</h3>

        <Card className="rounded-2xl shadow-sm border border-gray-200">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm table-fixed border-collapse">
              <thead className="bg-[#4ca626]/80 text-white">
                <tr>
                  <th className="p-3 text-left w-36">Date</th>
                  <th className="p-3 text-left w-36">Time</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-center w-32">Status</th>
                </tr>
              </thead>

              <tbody>
                {patient.appointments?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                )}

                {patient.appointments?.map((a: Appointment) => {
                  const dateObj = new Date(a.date);
                  return (
                    <tr
                      key={a.id}
                      className="border-t hover:bg-[#4ca626]/10 transition"
                    >
                      <td className="p-3">{dateObj.toLocaleDateString()}</td>
                      <td className="p-3">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3">{a.reason}</td>
                      <td className="p-3 font-medium">{a.doctor.name}</td>
                      <td className="p-3 text-center">
                        <select
                          value={a.status}
                          disabled={updatingId === a.id}
                          onChange={(e) =>
                            updateAppointmentStatus(a.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold border
                            ${
                              a.status === "CONFIRMED"
                                ? "bg-[#4ca626]/30 text-[#4ca626]"
                                : a.status === "CANCELLED"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
