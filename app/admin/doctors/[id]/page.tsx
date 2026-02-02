"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserRound,
  Stethoscope,
  Phone,
  CalendarCheck,
  Users,
  Plus,
  X,
  Eye,
} from "lucide-react";

export default function DoctorDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const WORK_START = 9;
  const WORK_END = 17;
  const SLOT_MINUTES = 30;

  const [doctor, setDoctor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"appointments" | "patients">(
    "appointments"
  );
  const [open, setOpen] = useState(false);

  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error";
} | null>(null);


  /* ---------------- LOAD DOCTOR ---------------- */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/doctors/${id}`)
      .then((res) => res.json())
      .then(setDoctor);
  }, [id]);

  /* ---------------- LOAD PATIENTS (MODAL) ---------------- */
  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/patients")
      .then((res) => res.json())
      .then(setAllPatients);
  }, [open]);

  const formatBloodGroup = (bg: string | null | undefined) => {
  if (!bg) return "-";

  const map: Record<string, string> = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };

  return map[bg] || bg; // fallback to original if not found
};


  /* ---------------- UNIQUE PATIENTS ---------------- */
  const uniquePatients = useMemo(() => {
    if (!doctor?.appointments) return [];
    const map = new Map();
    doctor.appointments.forEach((a: any) => {
      if (a.patient && !map.has(a.patient.id)) {
        map.set(a.patient.id, a.patient);
      }
    });
    return Array.from(map.values());
  }, [doctor]);

  /* ---------------- FILTERED PATIENTS ---------------- */
  const filteredPatients = useMemo(() => {
    return uniquePatients.filter((p: any) => {
      const name = `${p.firstName} ${p.lastName ?? ""}`.toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    });
  }, [uniquePatients, searchQuery]);

  /* ---------------- AVAILABLE TIME SLOTS ---------------- */
  const availableSlots = useMemo(() => {
    if (!date || !doctor?.appointments) return [];

    const bookedTimes = doctor.appointments
      .filter((a: any) => new Date(a.date).toISOString().split("T")[0] === date)
      .map((a: any) =>
        new Date(a.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

    const slots: { time: string; disabled: boolean }[] = [];

    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const t = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        slots.push({ time: t, disabled: bookedTimes.includes(t) });
      }
    }

    return slots;
  }, [date, doctor]);

  /* ---------------- CREATE APPOINTMENT ---------------- */
  const createAppointment = async () => {
    if (!patientId || !date || !time || !reason) {
      alert("Please fill all fields");
      return;
    }

    await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: id,
        patientId,
        date: `${date}T${time}:00`,
        reason,
      }),
    });

    setOpen(false);
    setPatientId("");
    setDate("");
    setTime("");
    setReason("");

    fetch(`/api/admin/doctors/${id}`).then((res) => res.json()).then(setDoctor);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};


  /* ---------------- UPDATE STATUS ---------------- */
  const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  try {
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed");

    showToast("Appointment status updated successfully");

    fetch(`/api/admin/doctors/${id}`)
      .then((res) => res.json())
      .then(setDoctor);
  } catch (err) {
    showToast("Failed to update appointment status", "error");
  }
};

  /* ---------------- STATUS COLORS ---------------- */
  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!doctor) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">

      {toast && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
      toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
    }`}
  >
    {toast.message}
  </motion.div>
)}

      {/* PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6 shadow-sm"
      >
        <div className="p-4 bg-[#4ca626]/20 text-[#4ca626] rounded-lg">
          <UserRound size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#4ca626]">
            Dr. {doctor.name}
          </h1>
          <p className="text-gray-600">{doctor.department?.name}</p>
          <div className="flex gap-6 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Stethoscope size={14} /> {doctor.experience} yrs
            </span>
            <span className="flex items-center gap-1">
              <Phone size={14} /> {doctor.phone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {[
          { key: "appointments", label: "Appointments", icon: CalendarCheck },
          { key: "patients", label: "Patients", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 pb-2 border-b-2 ${
              activeTab === key
                ? "border-[#4ca626] text-[#4ca626]"
                : "border-transparent text-gray-500 hover:text-[#4ca626]"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* APPOINTMENTS */}
      {activeTab === "appointments" && (
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <div className="flex justify-between p-4 border-b">
            <h2 className="font-semibold text-[#4ca626]">Doctor Appointments</h2>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-[#4ca626] text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Plus size={16} /> New Appointment
            </button>
          </div>
<table className="w-full text-sm table-auto border-collapse">
  <thead className="bg-[#4ca626] text-white">
    <tr>
      <th className="p-3 text-left">Patient</th>
      <th className="p-3 text-center">Date</th>
      <th className="p-3 text-center">Time</th>
      <th className="p-3 text-left">Reason</th>
      <th className="p-3 text-center">Status</th>
      <th className="p-3 text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {doctor.appointments.map((a: any) => {
      const dateObj = new Date(a.date);
      const dateOnly = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeOnly = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <tr key={a.id} className="border-t hover:bg-green-50">
          <td className="p-3 text-left">{a.patient?.firstName} {a.patient?.lastName ?? ""}</td>
          <td className="p-3 text-center">{dateOnly}</td>
          <td className="p-3 text-center">{timeOnly}</td>
          <td className="p-3 text-left">{a.reason}</td>
          <td className="p-3 text-center">
            <select
  value={a.status}
  onChange={(e) => updateAppointmentStatus(a.id, e.target.value)}
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    a.status === "PENDING"
      ? "bg-yellow-100 text-yellow-800"   // pastel yellow
      : a.status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-800"    // pastel green
      : "bg-red-100 text-red-800"     // pastel gray for cancelled
  }`}
>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </td>
          <td className="p-3 text-center">
            <div className="relative group inline-block">
              <button
                onClick={() => window.open(`/api/appointments/${a.id}/pdf`, "_blank")}
                className="text-[#4ca626] hover:text-green-800"
              >
                <Eye size={18} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                View PDF
              </span>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>


        </div>
      )}

     {/* PATIENTS */}
{activeTab === "patients" && (
  <div className="border rounded-xl shadow-sm">
    {/* Header with title and search input */}
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="font-semibold text-[#4ca626] text-lg">Patient Appointments</h2>
      <input
        placeholder="Search patient"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-4 py-2 rounded-lg w-72 focus:ring-2 focus:ring-[#4ca626]"
      />
    </div>

    <table className="w-full text-sm table-auto border-collapse">
      <thead className="bg-[#4ca626] text-white">
        <tr>
          <th className="p-3 text-left">Patient</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Address</th>
          <th className="p-3 text-left">Blood Group</th>
          <th className="p-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredPatients.map((p: any) => (
          <tr key={p.id} className="border-t hover:bg-green-50">
            <td className="p-3 text-left">{p.firstName} {p.lastName ?? ""}</td>
            <td className="p-3 text-left">{p.phone}</td>
            <td className="p-3 text-left">{p.address}</td>
    <td className="p-3 text-left">{formatBloodGroup(p.bloodGroup)}</td>
            <td className="p-3 text-center">
              <button
                onClick={() => router.push(`/admin/patients/${p.id}`)}
                className="text-[#4ca626] hover:text-green-800"
              >
                <Eye size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-[#4ca626]">New Appointment</h3>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select patient</option>
              {allPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName ?? ""}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full border p-2 rounded"
            />

            {date && (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={slot.disabled}
                    onClick={() => setTime(slot.time)}
                    className={`text-sm px-2 py-1 rounded ${
                      slot.disabled
                        ? "bg-gray-200 text-gray-400"
                        : time === slot.time
                        ? "bg-[#4ca626] text-white"
                        : "bg-[#4ca626]/20 text-[#4ca626]"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            <input
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={createAppointment}
              className="w-full bg-[#4ca626] text-white py-2 rounded-lg hover:bg-green-700"
            >
              Create Appointment
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
