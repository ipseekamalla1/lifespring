"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Filter } from "lucide-react";
import Toast from "@/components/ui/Toast";

/* ================= TYPES ================= */

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  createdAt: string;
  hasDoctor: boolean;
  hasPatient: boolean;
};

/* ================= COMPONENT ================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<"" | "ADMIN" | "DOCTOR" | "PATIENT">("");
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ================= DATA ================= */

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
      setToast({ message: "Failed to load users", type: "error" });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= FILTER ================= */

  const filteredUsers = users
    .filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      roleFilter ? u.role === roleFilter : true
    );

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#4ca626]">Users</h1>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-green-50 transition"
        >
          <Filter size={16} />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-[#4ca626] outline-none"
      />

      {/* FILTERS */}
      {showFilters && (
        <div className="flex gap-4 bg-white p-4 border rounded-lg w-fit">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#4ca626] outline-none"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="PATIENT">Patient</option>
          </select>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Profile</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-green-50">
                <td className="px-4 py-3 font-medium">{u.email}</td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-[#4ca626]">
                    {u.role}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs">
                  {u.hasDoctor && "Doctor"}
                  {u.hasPatient && "Patient"}
                  {!u.hasDoctor && !u.hasPatient && "—"}
                </td>

                <td className="px-4 py-3 text-xs text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 flex justify-center gap-2">
                  <Link href={`/admin/users/${u.id}`} className="p-2 text-green-700 hover:text-green-900">
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
