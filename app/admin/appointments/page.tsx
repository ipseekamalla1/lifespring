"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Filter, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/* ================= TYPES ================= */

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
  patient: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
  doctor: {
    id: string;
    name: string | null;
    department?: { name: string } | null;
  };
};

type Doctor = { id: string; name: string };
type Patient = { id: string; firstName: string; lastName: string };

/* ================= CONSTANTS ================= */

const WORK_START = 9;
const WORK_END = 17;
const SLOT_MINUTES = 30;
const TODAY = new Date().toISOString().split("T")[0];

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

/* ================= COMPONENT ================= */

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /* Filters */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | AppointmentStatus>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  /* Modal */
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    id: "",
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });

  /* Toast */
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= LOAD DATA ================= */

  async function loadAll() {
    setLoading(true);
    const [a, p, d] = await Promise.all([
      fetch("/api/admin/appointments").then((r) => r.json()),
      fetch("/api/admin/patients").then((r) => r.json()),
      fetch("/api/admin/doctors").then((r) => r.json()),
    ]);
    setAppointments(a || []);
    setPatients(p || []);
    setDoctors(d || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= BOOKED SLOTS ================= */

  useEffect(() => {
    if (!form.doctorId || !form.date) return;

    fetch(
      `/api/appointments/byDoctor?doctorId=${form.doctorId}&date=${form.date}`
    )
      .then((r) => r.json())
      .then((data) => {
        setBookedSlots(
          data.map((a: any) =>
            new Date(a.date).toTimeString().slice(0, 5)
          )
        );
        setForm((f) => ({ ...f, time: "" }));
      });
  }, [form.doctorId, form.date]);

  const slots = useMemo(() => {
    const s = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const t = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        s.push({ time: t, disabled: bookedSlots.includes(t) });
      }
    }
    return s;
  }, [bookedSlots]);

  /* ================= CRUD ================= */

  async function handleSubmit() {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      showToast("Fill all fields", "error");
      return;
    }

    const payload = {
      patientId: form.patientId,
      doctorId: form.doctorId,
      date: `${form.date}T${form.time}:00`,
      reason: form.reason,
      id: form.id,
    };

    const res = await fetch("/api/admin/appointments", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      showToast("Operation failed", "error");
      return;
    }

    const updatedAppointment = await res.json();

    if (isEdit) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === updatedAppointment.id ? updatedAppointment : a))
      );
      showToast("Appointment updated");
    } else {
      setAppointments((prev) => [updatedAppointment, ...prev]);
      showToast("Appointment created");
    }

    setOpen(false);
    setIsEdit(false);
    setForm({ id: "", patientId: "", doctorId: "", date: "", time: "", reason: "" });
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      showToast("Failed to update status", "error");
      return;
    }

    const updated = await res.json();

    // Update local state without refreshing page
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...a, status: updated.status } : a))
    );

    showToast(`Appointment ${updated.status.toLowerCase()}`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete appointment?")) return;
    const res = await fetch("/api/admin/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      showToast("Failed to delete", "error");
      return;
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast("Appointment deleted");
  }

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    let data = [...appointments];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          `${a.patient.firstName} ${a.patient.lastName}`
            .toLowerCase()
            .includes(q) ||
          a.patient.phone?.includes(q) ||
          a.doctor.name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((a) => a.status === statusFilter);
    }

    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [appointments, search, statusFilter]);

  if (loading) return <div className="p-6">Loading…</div>;

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen relative">
      {/* TOAST */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Appointments</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} className="mr-2" /> Filters
          </Button>
          <Button className="bg-[#4ca626]" onClick={() => setOpen(true)}>
            <Plus size={18} className="mr-2" /> Add Appointment
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search patient / doctor / phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />

      {/* FILTERS */}
      {showFilters && (
        <div className="flex gap-4 border p-4 rounded">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border px-3 py-2 rounded"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
          >
            Reset
          </Button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b hover:bg-green-50">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {new Date(a.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(a.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {a.patient.firstName} {a.patient.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{a.patient.phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{a.doctor.name}</div>
                  <div className="text-xs text-gray-500">
                    {a.doctor.department?.name || "—"}
                  </div>
                </td>
                <td className="px-4 py-3">{a.reason}</td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) =>
                      updateStatus(a.id, e.target.value as AppointmentStatus)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[a.status]
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      window.open(`/api/appointments/${a.id}/pdf`, "_blank")
                    }
                  >
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleDelete(a.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {isEdit ? "Edit Appointment" : "New Appointment"}
              </h3>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <select
              value={form.patientId}
              onChange={(e) =>
                setForm({ ...form, patientId: e.target.value })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>

            <select
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              min={TODAY}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border p-2 rounded w-full"
            />

            {form.date && form.doctorId && (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((s) => (
                  <button
                    key={s.time}
                    disabled={s.disabled}
                    onClick={() => setForm({ ...form, time: s.time })}
                    className={`py-1 rounded ${
                      s.disabled
                        ? "bg-gray-200 text-gray-400"
                        : form.time === s.time
                        ? "bg-[#4ca626] text-white"
                        : "bg-[#4ca626]/20 text-[#4ca626]"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            )}

            <input
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="border p-2 rounded w-full"
            />

            <Button onClick={handleSubmit} className="bg-[#4ca626] w-full">
              {isEdit ? "Update Appointment" : "Create Appointment"}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
