"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import Toast from "@/components/ui/Toast";

/* ================= TYPES ================= */

type Department = {
  id: string;
  name: string;
};

/* ================= COMPONENT ================= */

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<{ id: string; name: string }>({ id: "", name: "" });

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ================= LOAD DATA ================= */

  const loadDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      setDepartments([]);
      setToast({ message: "Failed to load departments", type: "error" });
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ================= ACTIONS ================= */

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setToast({ message: "Department name is required", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/admin/departments", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "Operation failed", type: "error" });
        return;
      }

      setToast({ message: isEdit ? "Department updated" : "Department created", type: "success" });
      setOpen(false);
      setForm({ id: "", name: "" });
      setIsEdit(false);
      loadDepartments();
    } catch {
      setToast({ message: "Server error", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this department?")) return;

    try {
      const res = await fetch("/api/admin/departments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error || "Delete failed", type: "error" });
        return;
      }

      setToast({ message: "Department deleted", type: "success" });
      loadDepartments();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const openEdit = (d: Department) => {
    setIsEdit(true);
    setForm({ id: d.id, name: d.name });
    setOpen(true);
  };

  /* ================= FILTER ================= */

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Departments</h1>

        <button
          onClick={() => { setForm({ id: "", name: "" }); setIsEdit(false); setOpen(true); }}
          className="flex items-center gap-2 bg-[#4ca626] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search departments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-[#4ca626] outline-none"
      />

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Department Name</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDepartments.map(d => (
              <tr key={d.id} className="border-b hover:bg-green-50">
                <td className="px-4 py-3 font-medium">{d.name}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button onClick={() => openEdit(d)} className="p-2 text-blue-600 hover:text-blue-800">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredDepartments.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500">
                  No departments found
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
              <h2 className="text-lg font-semibold">{isEdit ? "Edit Department" : "Add Department"}</h2>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <input
                placeholder="Department Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#4ca626] text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {isEdit ? "Update Department" : "Create Department"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
