"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Toast from "@/components/ui/Toast";

/* ================= TYPES ================= */

type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
  patient: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
  doctor: {
    name: string | null;
    department: {
      name: string;
    } | null;
  };
};

/* ================= CONSTANTS ================= */

const emptyForm = {
  id: "",
  date: "",
  reason: "",
  status: "PENDING" as AppointmentStatus,
  patientId: "",
  doctorId: "",
};

/* ================= STYLES ================= */

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

/* ================= COMPONENT ================= */

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  /* ================= DATA ================= */

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  /* ================= CRUD ================= */

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Operation failed", "error");
        return;
      }

      showToast(isEdit ? "Appointment updated" : "Appointment created");
      setOpen(false);
      setForm(emptyForm);
      setIsEdit(false);
      loadAppointments();
    } catch {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;

    try {
      const res = await fetch("/api/admin/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Delete failed", "error");
        return;
      }

      showToast("Appointment deleted");
      loadAppointments();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEdit = (appt: Appointment) => {
    setIsEdit(true);
    setForm({
      id: appt.id,
      date: appt.date.slice(0, 16), // for datetime-local input
      reason: appt.reason,
      status: appt.status,
      patientId: "", // ideally fetch patient id
      doctorId: "", // ideally fetch doctor id
    });
    setOpen(true);
  };

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      showToast("Status updated");
      loadAppointments();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ================= FILTERING ================= */

  const filteredAppointments = useMemo(() => {
    let data = [...appointments];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(a => {
        const patientName = `${a.patient?.firstName ?? ""} ${a.patient?.lastName ?? ""}`.toLowerCase();
        return (
          patientName.includes(q) ||
          a.patient?.phone?.includes(q) ||
          a.doctor?.name?.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "ALL") {
      data = data.filter(a => a.status === statusFilter);
    }

    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, search, statusFilter]);

  /* ================= UI ================= */

  if (loading) return <div className="p-6 text-emerald-700">Loading appointments…</div>;

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Appointments</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} className="mr-2" /> Filters
          </Button>
          <Button className="bg-[#4ca626]" onClick={() => { setForm(emptyForm); setIsEdit(false); setOpen(true); }}>
            <Plus size={18} className="mr-2" /> Add Appointment
          </Button>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Search patient / doctor / phone"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-[#4ca626] outline-none"
      />

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-4 bg-white p-4 border rounded-lg w-fit">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
            className="px-4 py-2 border rounded hover:bg-green-50 transition"
          >
            Reset
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map(appt => {
              const patientName = `${appt.patient?.firstName ?? ""} ${appt.patient?.lastName ?? ""}`.trim() || "—";
              const doctorName = appt.doctor?.name ?? "—";
              return (
                <tr key={appt.id} className="border-b hover:bg-green-50">
                  <td className="px-4 py-3">{new Date(appt.date).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{patientName}</div>
                    <div className="text-xs text-gray-500">{appt.patient?.phone || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{doctorName}</div>
                    <div className="text-xs text-gray-500">{appt.doctor?.department?.name || "—"}</div>
                  </td>
                  <td className="px-4 py-3">{appt.reason}</td>
                  <td className="px-4 py-3">
                    <select
                      value={appt.status}
                      onChange={e => updateStatus(appt.id, e.target.value as AppointmentStatus)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${statusStyles[appt.status]}`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button onClick={() => openEdit(appt)} className="p-2 text-blue-600 hover:text-blue-800">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(appt.id)} className="p-2 text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-lg">

            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{isEdit ? "Edit Appointment" : "Add Appointment"}</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">X</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="datetime-local"
                placeholder="Date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
              />

              <input
                type="text"
                placeholder="Reason"
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
              />

              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEdit ? "Update Appointment" : "Create Appointment"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
