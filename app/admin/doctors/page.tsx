"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Toast from "../../../components/ui/Toast";

/* ================= TYPES ================= */

type Doctor = {
  id: string;
  name: string;
  department: string;
  departmentId: string;
  specialization: string;
  experience: number;
  email: string;
  phone: string;
  patientsCount: number;
  status: "ACTIVE" | "INACTIVE";
};

type Department = {
  id: string;
  name: string;
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  departmentId: "",
  specialization: "",
  phone: "",
  experience: "",
};

/* ================= COMPONENT ================= */

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  /* ================= LOAD DATA ================= */

  const loadDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(Array.isArray(data) ? data : []);
  };

  const loadDepartments = async () => {
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    setDepartments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadDoctors();
    loadDepartments();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/doctors", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong", "error");
        return;
      }

      showToast(
        isEdit ? "Doctor updated successfully" : "Doctor created successfully"
      );

      setOpen(false);
      setForm(emptyForm);
      setIsEdit(false);
      loadDoctors();
    } catch {
      showToast("Server error", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;

    try {
      const res = await fetch("/api/admin/doctors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.error || "Doctor has appointments. Remove them first.",
          "error"
        );
        return;
      }

      showToast("Doctor deleted successfully");
      loadDoctors();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const toggleStatus = async (doc: Doctor) => {
    const newStatus = doc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await fetch("/api/admin/doctors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, status: newStatus }),
    });

    showToast(`Doctor is now ${newStatus}`);
    loadDoctors();
  };

  const openAdd = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setIsEdit(true);
    setForm({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      departmentId: doc.departmentId,
      specialization: doc.specialization,
      phone: doc.phone,
      experience: doc.experience.toString(),
    });
    setOpen(true);
  };

  /* ================= FILTER ================= */

  const filteredDoctors = doctors
    .filter((doc) => {
      const q = search.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.email.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q)
      );
    })
    .filter((doc) =>
      statusFilter === "ALL" ? true : doc.status === statusFilter
    );

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Doctors</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="border px-4 py-2 rounded-lg bg-white"
          >
            <Filter size={16} />
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add Doctor
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-72"
      />

      {showFilters && (
  <div className="flex gap-4 bg-white p-4 border rounded-lg w-fit">
    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
      }
      className="border px-3 py-2 rounded"
    >
      <option value="ALL">All Status</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
    </select>

    <button
      onClick={() => {
        setSearch("");
        setStatusFilter("ALL");
      }}
      className="px-4 py-2 border rounded-lg text-sm"
    >
      Reset
    </button>
  </div>
)}


      {/* TABLE */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4">Patients</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="border-t bg-white">
                  <td className="p-4 font-medium">{doc.name}</td>
                  <td className="p-4">{doc.department}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(doc)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        doc.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {doc.status}
                    </button>
                  </td>
                  <td className="p-4">{doc.patientsCount}</td>
                  <td className="p-4">{doc.experience} yrs</td>
                  <td className="p-4 text-xs">
                    <p>{doc.email}</p>
                    <p className="text-gray-500">{doc.phone}</p>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <Link href={`/admin/doctors/${doc.id}`} className="p-2">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => openEdit(doc)} className="p-2">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">
                {isEdit ? "Edit Doctor" : "Add Doctor"}
              </h2>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                placeholder="Email"
                disabled={isEdit}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border p-2 rounded bg-gray-100"
              />

              <select
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                placeholder="Specialization"
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Experience (years)"
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg"
            >
              {isEdit ? "Update Doctor" : "Create Doctor"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
