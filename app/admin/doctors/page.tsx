"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/* ================= TYPES ================= */

type Doctor = {
  id: string;
  name: string;
  department: string;
  specialization: string;
  experience: number;
  email: string;
  phone: string;
  patientsCount: number;
  status: "ACTIVE" | "INACTIVE";
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  department: "",
  specialization: "",
  phone: "",
  experience: "",
};

/* ================= COMPONENT ================= */

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  /* ---------- SEARCH / FILTER / SORT STATE ---------- */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<keyof Doctor | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* ================= DATA ================= */

  const loadDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    const method = isEdit ? "PUT" : "POST";

    await fetch("/api/admin/doctors", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    setForm(emptyForm);
    setIsEdit(false);
    loadDoctors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;

    await fetch("/api/admin/doctors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadDoctors();
  };

  const openEdit = (doc: Doctor) => {
    setIsEdit(true);
    setForm({
      id: doc.id,
      name: doc.name,
      email: doc.email,
      department: doc.department,
      specialization: doc.specialization,
      phone: doc.phone,
      experience: doc.experience.toString(),
    });
    setOpen(true);
  };

  const toggleStatus = async (doc: Doctor) => {
    const newStatus = doc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await fetch("/api/admin/doctors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, status: newStatus }),
    });

    loadDoctors();
  };

  /* ================= SORT ================= */

  const handleSort = (key: keyof Doctor) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortArrow = ({ column }: { column: keyof Doctor }) =>
    sortKey === column ? (sortOrder === "asc" ? " ↑" : " ↓") : null;

  /* ================= FILTERED DATA ================= */

  const filteredDoctors = doctors
    .filter((doc) => {
      const q = search.toLowerCase();
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.email.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.department.toLowerCase().includes(q)
      );
    })
    .filter((doc) =>
      statusFilter === "ALL" ? true : doc.status === statusFilter
    )
    .filter((doc) =>
      departmentFilter === "ALL" ? true : doc.department === departmentFilter
    )
    .sort((a, b) => {
      if (!sortKey) return 0;

      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Doctors</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setIsEdit(false);
            setOpen(true);
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} /> Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="ALL">All Departments</option>
          {[...new Set(doctors.map(d => d.department))].map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-100">
              <tr>
                <th onClick={() => handleSort("name")} className="p-4 text-left cursor-pointer">
                  Name<SortArrow column="name" />
                </th>
                <th onClick={() => handleSort("specialization")} className="p-4 cursor-pointer">
                  Specialty<SortArrow column="specialization" />
                </th>
                <th onClick={() => handleSort("status")} className="p-4 cursor-pointer">
                  Status<SortArrow column="status" />
                </th>
                <th onClick={() => handleSort("patientsCount")} className="p-4 cursor-pointer">
                  Patients<SortArrow column="patientsCount" />
                </th>
                <th onClick={() => handleSort("experience")} className="p-4 cursor-pointer">
                  Experience<SortArrow column="experience" />
                </th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-emerald-50">
                  <td className="p-4 font-medium">{doc.name}</td>
                  <td className="p-4">{doc.specialization}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(doc)}
                      className={`px-3 py-1 rounded-full text-xs
                        ${doc.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-600"}
                      `}
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
                    <Link href={`/admin/doctors/${doc.id}`} className="p-2 hover:bg-emerald-100 rounded">
                      <Eye size={16} />
                    </Link>
                    <button onClick={() => openEdit(doc)} className="p-2 hover:bg-blue-100 rounded">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-red-100 rounded text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-500">
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ===== MODAL (UNCHANGED) ===== */}
     {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-5 border-b bg-gradient-to-r from-emerald-50 to-white">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Doctor Profile" : "Add New Doctor"}
          </h2>
          <p className="text-sm text-gray-500">
            Enter professional and contact details
          </p>
        </div>
        <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800">
          <X size={22} />
        </button>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-6">

        {/* Name – FULL WIDTH */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter Full Name"
            className="w-full h-12 border rounded-xl px-4 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isEdit}
              placeholder="Enter email"
              className={`w-full h-11 border rounded-xl px-4 ${
                isEdit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter Number"
              className="w-full h-11 border rounded-xl px-4"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Enter department"
              className="w-full h-11 border rounded-xl px-4"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder="Enter Speciality"
              className="w-full h-11 border rounded-xl px-4"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min={0}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="Enter Experience"
              className="w-full h-11 border rounded-xl px-4"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 px-8 py-5 border-t bg-gray-50">
        <button
          onClick={() => setOpen(false)}
          className="px-6 py-2 rounded-xl border hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
        >
          {isEdit ? "Update Doctor" : "Create Doctor"}
        </button>
      </div>

    </div>
  </div>
)}


    </div>
  );
}
