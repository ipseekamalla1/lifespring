"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    useState<"ALL" | "ADMIN" | "DOCTOR" | "PATIENT">("ALL");
  const [showFilters, setShowFilters] = useState(false);

  /* ================= DATA ================= */

  const loadUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
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
      roleFilter === "ALL" ? true : u.role === roleFilter
    );

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-800">Users</h1>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-emerald-50"
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
        className="px-4 py-2 border rounded-lg w-64"
      />

      {/* FILTERS */}
      {showFilters && (
        <Card className="p-4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="PATIENT">Patient</option>
          </select>
        </Card>
      )}

      {/* TABLE */}
      <Card className="rounded-2xl shadow">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Created</th>
            
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-emerald-50">
                  <td className="p-4 font-medium">{user.email}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-xs">
                    {user.hasDoctor && "Doctor"}
                    {user.hasPatient && "Patient"}
                    {!user.hasDoctor && !user.hasPatient && "—"}
                  </td>

                  <td className="p-4 text-xs text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    No users found
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
