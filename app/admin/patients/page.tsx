"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type Patient = {
  id: string;
  firstName: string;
  lastName?: string | null;
  dateOfBirth?: string | null; // ISO string
  gender: string | null;
  address: string | null;
  phone: string;
  user: { email: string };
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;

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

/* ================= TOAST ================= */

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded text-white shadow
        ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}

/* ================= HELPER ================= */

// Calculate age from dateOfBirth
const getAge = (dob?: string | null) => {
  if (!dob) return null;
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

  const [toast, setToast] = useState<{ msg: string; type: any } | null>(null);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  const [page, setPage] = useState(1);

  /* ================= DATA ================= */

  const loadPatients = async () => {
    const res = await fetch("/api/admin/patients");
    const data = await res.json();
    setPatients(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  /* ================= CRUD ================= */

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/patients", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setToast({ msg: isEdit ? "Patient updated" : "Patient created", type: "success" });
      setOpen(false);
      setForm(emptyForm);
      setIsEdit(false);
      loadPatients();
    } else {
      setToast({ msg: "Operation failed", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this patient?")) return;

    const res = await fetch("/api/admin/patients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setToast({ msg: "Patient deleted", type: "success" });
      loadPatients();
    } else {
      setToast({ msg: "Delete failed", type: "error" });
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

  /* ================= FILTERING ================= */

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();

    const matchesSearch =
      (p.firstName?.toLowerCase().includes(q) ?? false) ||
      (p.lastName?.toLowerCase().includes(q) ?? false) ||
      (p.user?.email?.toLowerCase().includes(q) ?? false) ||
      (p.phone?.includes(q) ?? false);

    const matchesGender = genderFilter ? p.gender === genderFilter : true;

    const age = getAge(p.dateOfBirth);

    const matchesAge =
      !ageFilter ||
      (ageFilter === "0-18" && age !== null && age <= 18) ||
      (ageFilter === "19-40" && age !== null && age >= 19 && age <= 40) ||
      (ageFilter === "41-60" && age !== null && age >= 41 && age <= 60) ||
      (ageFilter === "60+" && age !== null && age > 60);

    return matchesSearch && matchesGender && matchesAge;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Patients</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          <Button
            className="bg-emerald-600"
            onClick={() => {
              setForm(emptyForm);
              setIsEdit(false);
              setOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" /> Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <input
        className="px-4 py-2 border rounded-lg w-64"
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 flex gap-4">
          <select
            className="border p-2 rounded"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <select
            className="border p-2 rounded"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">All Ages</option>
            <option value="0-18">0–18</option>
            <option value="19-40">19–40</option>
            <option value="41-60">41–60</option>
            <option value="60+">60+</option>
          </select>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Age</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-t hover:bg-emerald-50">
                  <td className="p-4">{p.firstName} {p.lastName || ""}</td>
                  <td className="p-4">{p.user.email}</td>
                  <td className="p-4">{getAge(p.dateOfBirth) ?? "-"}</td>
                  <td className="p-4">{p.phone}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <Link href={`/admin/patients/${p.id}`} className="p-2 hover:bg-emerald-100 rounded">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-100 rounded">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-100 rounded text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span className="px-2">Page {page} / {totalPages || 1}</span>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            {/* Header */}
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {isEdit ? "Edit Patient" : "Add New Patient"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEdit ? "Update patient information below" : "Fill in the patient details"}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              {["firstName", "lastName", "email", "dateOfBirth", "phone", "address"].map((f) => (
                <div key={f} className="space-y-1">
                  <label className="text-sm font-medium capitalize text-gray-700">
                    {f === "dateOfBirth" ? "Date of Birth" : f}
                  </label>
                  <input
                    type={f === "dateOfBirth" ? "date" : "text"}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder={`Enter ${f}`}
                    value={form[f]}
                    disabled={isEdit && f === "email"}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                </div>
              ))}

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{isEdit ? "Update Patient" : "Create Patient"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
