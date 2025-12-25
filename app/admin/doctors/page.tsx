"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Plus, Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Doctor = {
  id: string;
  name: string;
  department: string
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

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);

  const loadDoctors = async () => {
    const res = await fetch("/api/admin/doctors");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

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
    body: JSON.stringify({
      id: doc.id,
      status: newStatus,
    }),
  });

  loadDoctors();
};


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

      {/* Table */}
      <Card className="rounded-2xl border shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-100">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4">Specialty</th>
                <th className="p-4">Status</th>
                <th className="p-4">Patients</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-emerald-50">
                  <td className="p-4 font-medium">{doc.name}</td>
                  <td className="p-4">{doc.specialization}</td>
                 <td className="p-4">
  <button
    onClick={() => toggleStatus(doc)}
    className={`px-3 py-1 rounded-full text-xs font-medium transition
      ${doc.status === "ACTIVE"
        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"}
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

              {doctors.length === 0 && (
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

      {/* Modal */}
      {/* Modal */}
{open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? "Edit Doctor Profile" : "Add New Doctor"}
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <X />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "name", label: "Full Name" },
            { key: "email", label: "Email Address" },
            { key: "department", label: "Department" },
            { key: "specialization", label: "Specialization" },
            { key: "phone", label: "Phone Number" },
            { key: "experience", label: "Years of Experience" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-600">
                {label}
              </label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                disabled={isEdit && key === "email"}
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                  ${isEdit && key === "email" ? "bg-gray-100 cursor-not-allowed" : ""}
                `}
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
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
