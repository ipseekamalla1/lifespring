"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserRound,
  Stethoscope,
  Phone,
  CalendarCheck,
  Users,
  Plus,
  X,
} from "lucide-react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // WORK HOURS & SLOT LENGTH
  const WORK_START = 9;
  const WORK_END = 17;
  const SLOT_MINUTES = 30;

  /* ---------------- STATES ---------------- */
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
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const router = useRouter();


  /* ---------------- LOAD DOCTOR ---------------- */
  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/doctors/${id}`)
      .then((res) => res.json())
      .then(setDoctor)
      .catch(console.error);
  }, [id]);

  /* ---------------- LOAD PATIENTS WHEN MODAL OPENS ---------------- */
  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/patients")
      .then((res) => res.json())
      .then(setAllPatients)
      .catch(console.error);
  }, [open]);

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
  return uniquePatients.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const phone = p.phone || "";
    const gender = p.gender || "";
    const age = p.age ?? null;

    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery);

    const matchesGender = genderFilter
      ? gender === genderFilter
      : true;

    const matchesAge = ageFilter
      ? age !== null &&
        (ageFilter === "0-18"
          ? age <= 18
          : ageFilter === "19-35"
          ? age >= 19 && age <= 35
          : ageFilter === "36-60"
          ? age >= 36 && age <= 60
          : age >= 61)
      : true;

    return matchesSearch && matchesGender && matchesAge;
  });
}, [uniquePatients, searchQuery, genderFilter, ageFilter]);

  /* ---------------- AVAILABLE SLOTS ---------------- */
  const availableSlots = useMemo(() => {
    if (!date || !doctor?.appointments) return [];

    const booked = doctor.appointments
      .filter((a: any) => a.date.split("T")[0] === date)
      .map((a: any) => new Date(a.date).toTimeString().slice(0, 5));

    const allSlots: string[] = [];
    for (let hour = WORK_START; hour < WORK_END; hour++) {
      for (let min = 0; min < 60; min += SLOT_MINUTES) {
        const h = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");
        allSlots.push(`${h}:${m}`);
      }
    }

    return allSlots;
  }, [date, doctor]);

  /* ---------------- CREATE APPOINTMENT ---------------- */
  const createAppointment = async () => {
    if (!patientId || !date || !time || !reason) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: id,
        patientId,
        date: date + "T" + time + ":00",
        reason,
      }),
    });

    if (!res.ok) {
      alert("Failed to create appointment");
      return;
    }

    setPatientId("");
    setDate("");
    setTime("");
    setReason("");
    setOpen(false);

    // Refresh doctor appointments
    fetch(`/api/admin/doctors/${id}`)
      .then((res) => res.json())
      .then(setDoctor);
  };

const updateAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  console.log("Updating appointment:", appointmentId);


  if (!res.ok) {
    alert("Failed to update status");
    return;
  }

  // Refresh doctor data
  fetch(`/api/admin/doctors/${id}`)
    .then((res) => res.json())
    .then(setDoctor);
};


  if (!doctor) return <p className="p-6 text-emerald-700">Loading doctor...</p>;

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* ================= DOCTOR PROFILE ================= */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border shadow p-6 flex gap-6"
      >
        <div className="p-5 bg-emerald-600 text-white rounded-xl">
          <UserRound size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-emerald-800">
            Dr. {doctor.name}
          </h1>
    
          <p className="text-emerald-700">
             {doctor.department?.name}
          </p>
          <div className="mt-3 flex gap-6 text-sm text-emerald-700">
            <span className="flex items-center gap-1">
              <Stethoscope size={16} /> {doctor.experience} yrs
            </span>
            <span className="flex items-center gap-1">
              <Phone size={16} /> {doctor.phone}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ================= TABS ================= */}
      <div className="flex gap-4 border-b">
        {[
          { key: "appointments", label: "Appointments", icon: CalendarCheck },
          { key: "patients", label: "Patients", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`px-4 py-2 flex gap-2 items-center border-b-2 ${
              activeTab === key
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-emerald-600"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ================= APPOINTMENTS ================= */}
      {activeTab === "appointments" && (
        <div className="bg-white rounded-2xl border shadow">

          <div className="flex justify-between p-4 border-b">
            <h2 className="font-semibold text-emerald-800">Doctor Appointments</h2>
            <button
              onClick={() => setOpen(true)}
              className="flex gap-2 items-center bg-emerald-600 text-white px-4 py-2 rounded-xl"
            >
              <Plus size={16} /> New Appointment
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {doctor.appointments.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-emerald-600">
                    No appointments scheduled
                  </td>
                </tr>
              )}
              {doctor.appointments.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.patient?.name}</td>
                  <td className="p-4">{new Date(a.date).toLocaleString()}</td>
                  <td className="p-4">{a.reason}</td>
                  <td className="p-4">
  <select
    value={a.status}
    onChange={(e) =>
      updateAppointmentStatus(a.id, e.target.value)
    }
    className={`px-3 py-1 rounded-full text-xs font-semibold border
      ${
        a.status === "CONFIRMED"
          ? "bg-green-100 text-green-700"
          : a.status === "CANCELLED"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
  >
    <option value="PENDING">Pending</option>
    <option value="CONFIRMED">Confirmed</option>
    <option value="CANCELLED">Cancelled</option>
  </select>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PATIENTS ================= */}
{activeTab === "patients" && (
  <div className="bg-white rounded-2xl border shadow space-y-4">

    {/* SEARCH & FILTER BAR */}
    <div className="flex flex-col md:flex-row gap-4 p-4 border-b">
      <input
        type="text"
        placeholder="Search by name or phone..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/2 border rounded-xl px-4 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <div className="flex gap-3">
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">All Ages</option>
          <option value="0-18">0-18</option>
          <option value="19-35">19-35</option>
          <option value="36-60">36-60</option>
          <option value="60+">60+</option>
        </select>
      </div>
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-emerald-50 text-emerald-700">
          <tr>
            <th className="p-4 text-left font-medium">Patient</th>
            <th className="p-4 font-medium">Age</th>
            <th className="p-4 font-medium">Gender</th>
            <th className="p-4 font-medium">Phone</th>
            <th className="p-4 font-medium text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-emerald-600">
                No patients found
              </td>
            </tr>
          )}

          {filteredPatients.map((p: any) => (
            <tr
              key={p.id}
              className="border-t hover:bg-emerald-50 transition"
            >
              <td className="p-4 font-medium">{p.name}</td>
              <td className="p-4 text-center">{p.age ?? "—"}</td>
              <td className="p-4 text-center">{p.gender ?? "—"}</td>
              <td className="p-4 text-center">{p.phone}</td>

              {/* VIEW BUTTON */}
              <td className="p-4 text-center">
                <button
                  onClick={() => router.push(`/admin/patients/${p.id}`)}
                  className="inline-flex items-center gap-1
                  text-emerald-600 hover:text-emerald-800"
                >
                  <Eye size={18} />
                  <span className="hidden md:inline text-sm">View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-emerald-800 mb-4">
              New Appointment
            </h3>

            <div className="space-y-4">
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select patient</option>
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              <input
                type="text"
                placeholder="Reason for Visit"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              {date && (
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isBooked = doctor.appointments
                        .filter((a: any) => a.date.split("T")[0] === date)
                        .map((a: any) =>
                          new Date(a.date).toTimeString().slice(0, 5)
                        )
                        .includes(slot);

                      const today = new Date().toISOString().split("T")[0];
                      const [hour, min] = slot.split(":").map(Number);
                      const now = new Date();
                      const isPast =
                        date === today &&
                        (hour < now.getHours() ||
                          (hour === now.getHours() && min <= now.getMinutes()));

                      const disabled = isBooked || isPast;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          onClick={() => setTime(slot)}
                          className={`py-1 rounded-xl text-sm font-medium border
                            ${
                              disabled
                                ? "bg-red-100 text-red-500 cursor-not-allowed"
                                : time === slot
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  onClick={createAppointment}
                  className="px-4 py-2 rounded-xl
                    bg-gradient-to-r from-emerald-500 to-green-600
                    text-white font-medium"
                >
                  Create
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
