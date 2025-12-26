"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type Patient = {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  address: string | null;
  phone: string;
  user: { email: string };
};

/* ================= EMPTY FORM ================= */

const emptyForm = {
  id: "",
  name: "",
  email: "",
  age: "",
  gender: "",
  address: "",
  phone: "",
};

/* ================= COMPONENT ================= */

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  /* SEARCH + SORT */
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "age" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  /* FILTERS */
  const [showFilters, setShowFilters] = useState(false);

  /* ================= DATA ================= */

  const loadPatients = async () => {
    const res = await fetch("/api/admin/patients");
    const data = await res.json();
    setPatients(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    await fetch("/api/admin/patients", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    setForm(emptyForm);
    setIsEdit(false);
    loadPatients();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this patient?")) return;

    await fetch("/api/admin/patients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadPatients();
  };

  const openEdit = (p: Patient) => {
    setIsEdit(true);
    setForm({
      id: p.id,
      name: p.name,
      email: p.user.email,
      age: p.age ?? "",
      gender: p.gender ?? "",
      address: p.address ?? "",
      phone: p.phone,
    });
    setOpen(true);
  };

  /* ================= SORT ================= */

  const handleSort = (key: "name" | "age") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  /* ================= FILTERED DATA ================= */

  const filteredPatients = patients
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.user.email.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Patients</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
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

      {/* SEARCH */}
      <input
        placeholder="Search patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-64"
      />

      {/* FILTER PANEL (reserved for future filters) */}
      {showFilters && (
        <Card className="p-4 text-sm text-gray-600">
          Filters can be added here later (status, gender, age, etc.)
        </Card>
      )}

      {/* TABLE */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-100">
              <tr>
                <th onClick={() => handleSort("name")} className="p-4 cursor-pointer">Name</th>
                <th className="p-4">Email</th>
                <th onClick={() => handleSort("age")} className="p-4 cursor-pointer">Age</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id} className="border-t hover:bg-emerald-50">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.user.email}</td>
                  <td className="p-4">{p.age ?? "-"}</td>
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

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
