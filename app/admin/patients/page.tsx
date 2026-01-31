"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, X, Filter } from "lucide-react";
import Toast from "../../../components/ui/Toast";

/* ================= TYPES ================= */

type Patient = {
  id: string;
  firstName: string;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO string
  gender?: string | null;
  address?: string | null;
  phone: string;
  user: { email: string };
};

const emptyForm = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
};

/* ================= HELPER ================= */

const getAge = (dob?: string | null) => {
  if (!dob) return "-";
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age;
};

/* ================= COMPONENT ================= */

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<"" | "MALE" | "FEMALE">("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ================= LOAD DATA ================= */

  const loadPatients = async () => {
    try {
      const res = await fetch("/api/admin/patients");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch {
      setPatients([]);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/patients", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "Operation failed", type: "error" });
        return;
      }

      setToast({ message: isEdit ? "Patient updated" : "Patient created", type: "success" });
      setOpen(false);
      setForm(emptyForm);
      setIsEdit(false);
      loadPatients();
    } catch {
      setToast({ message: "Server error", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this patient?")) return;

    try {
      const res = await fetch("/api/admin/patients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "Delete failed", type: "error" });
        return;
      }

      setToast({ message: "Patient deleted", type: "success" });
      loadPatients();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const openEdit = (p: Patient) => {
    setIsEdit(true);
    setForm({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName || "",
      email: p.user.email,
      dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
      gender: p.gender || "",
      address: p.address || "",
      phone: p.phone,
    });
    setOpen(true);
  };

  /* ================= FILTER ================= */

  const filteredPatients = patients
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.firstName.toLowerCase().includes(q) ||
        (p.lastName?.toLowerCase().includes(q) ?? false) ||
        p.user.email.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    })
    .filter((p) => (genderFilter ? p.gender === genderFilter : true));

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Patients</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border px-4 py-2 rounded-lg bg-white hover:bg-green-50 transition"
          >
            <Filter size={16} />
          </button>

          <button
            onClick={() => { setForm(emptyForm); setIsEdit(false); setOpen(true); }}
            className="flex items-center gap-2 bg-[#4ca626] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={18} /> Add Patient
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-[#4ca626] outline-none"
      />

      {/* FILTERS */}
      {showFilters && (
        <div className="flex gap-4 bg-white p-4 border rounded-lg w-fit">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as "" | "MALE" | "FEMALE")}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <button
            onClick={() => { setSearch(""); setGenderFilter(""); }}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-green-50 transition"
          >
            Reset
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Gender</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.id} className="border-b hover:bg-green-50">
                <td className="px-4 py-3 font-medium">{p.firstName} {p.lastName || ""}</td>
                <td className="px-4 py-3">{p.user.email}</td>
                <td className="px-4 py-3">{getAge(p.dateOfBirth)}</td>
                <td className="px-4 py-3">{p.gender || "-"}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3">{p.address || "-"}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <Link href={`/admin/patients/${p.id}`} className="p-2 text-green-700 hover:text-green-900">
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:text-blue-800">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-lg">

            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{isEdit ? "Edit Patient" : "Add Patient"}</h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
              <input
                placeholder="Email"
                disabled={isEdit}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none disabled:bg-gray-100"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="border p-2 rounded col-span-2 focus:ring-2 focus:ring-[#4ca626] outline-none"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#4ca626] text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {isEdit ? "Update Patient" : "Create Patient"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
