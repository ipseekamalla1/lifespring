"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Eye } from "lucide-react";
import { toast } from "sonner";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  doctor: {
   
    name: string;
    specialization: string;
    department: string;
    phone: string | null;
  };
};

export default function DoctorPatientProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/doctor/patients/${id}`)
      .then((res) => res.json())
      .then(setPatient)
      .catch(() => toast.error("Failed to load patient"));
  }, [id]);

  if (!patient) {
    return (
      <div className="p-10 text-[#4ca626] text-center">Loading patient profile…</div>
    );
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      setUpdatingId(appointmentId);
      const res = await fetch(`/api/doctor/appointments/${appointmentId}`, {
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
      toast.success("Appointment updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusClass = (status: string) =>
    status === "CONFIRMED"
      ? "bg-[#4ca626]/20 text-[#4ca626] border border-[#4ca626]"
      : status === "CANCELLED"
      ? "bg-white/0 text-[#4ca626] border border-[#4ca626]"
      : "bg-white/0 text-[#4ca626] border border-[#4ca626]";

  return (
    <div className="p-8 space-y-8 min-h-screen bg-white">
      {/* ================= PATIENT PROFILE CARD ================= */}
      <Card className="rounded-3xl shadow border border-[#4ca626]/30">
        <CardContent className="p-8 grid md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-24 w-24 rounded-full bg-[#4ca626]/20 flex items-center justify-center">
              <User size={40} className="text-[#4ca626]" />
            </div>
            <h2 className="text-2xl font-bold mt-4 text-[#4ca626]">
              {`${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unnamed Patient"}
            </h2>
            <Badge className="mt-2 bg-[#4ca626] text-white">Patient</Badge>
          </div>

          {/* MIDDLE */}
          <div className="space-y-3 text-[#4ca626]">
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
            <p className="font-medium text-[#4ca626]">Address</p>
            <p className="text-[#4ca626]/80">{patient.address ?? "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* ================= APPOINTMENTS ================= */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#4ca626]">Appointments</h3>

        <Card className="rounded-2xl shadow border border-[#4ca626]/30">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#4ca626] text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Doctor</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">View</th>
                </tr>
              </thead>

              <tbody>
                {patient.appointments?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-[#4ca626]/70">
                      No appointments found
                    </td>
                  </tr>
                )}

                {patient.appointments?.map((a: Appointment) => (
                  <tr key={a.id} className="border-t hover:bg-[#4ca626]/10 transition">
                    <td className="p-4">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="p-4">{a.reason}</td>
                    <td className="p-4">
                      <p className="font-medium text-[#4ca626]">
                        {` Dr. ${a.doctor.name}`}
                      </p>
                      {a.doctor.phone && (
                        <p className="text-xs text-[#4ca626]/70">📞 {a.doctor.phone}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-[#4ca626]">{a.doctor.department}</p>
                      <p className="text-xs text-[#4ca626]/70">{a.doctor.specialization}</p>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={a.status}
                        disabled={updatingId === a.id}
                        onChange={(e) => updateAppointmentStatus(a.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClass(a.status)}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="p-2 rounded-full bg-[#4ca626]/20 text-[#4ca626] hover:bg-[#4ca626]/40 transition"
                        onClick={() => router.push(`/doctor/appointments/${a.id}`)}
                        title="View Appointment"
                      >
                        <Eye size={18} />
                      </button>
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
