"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, X, Filter } from "lucide-react";
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

  /* SEARCH / FILTER / SORT */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<keyof Doctor | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  /* ================= DATA ================= */

  const loadDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    await fetch("/api/admin/doctors", {
      method: isEdit ? "PUT" : "POST",
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

      {/* HEADER (same as Patients) */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Doctors</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-emerald-50"
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

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
      </div>

      {/* SEARCH (always visible like Patients) */}
      <input
        placeholder="Search doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-64"
      />

      {/* FILTER PANEL (same pattern as Patients) */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
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
              {[...new Set(doctors.map((d) => d.department))].map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* TABLE */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th onClick={() => handleSort("name")} className="p-4 cursor-pointer">Name</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Status</th>
                <th onClick={() => handleSort("patientsCount")} className="p-4 cursor-pointer">Patients</th>
                <th onClick={() => handleSort("experience")} className="p-4 cursor-pointer">Experience</th>
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

      {/* MODAL — unchanged */}
      {/* (your existing modal code stays exactly the same) */}
    </div>
  );
}
