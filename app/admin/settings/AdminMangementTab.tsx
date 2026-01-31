"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Toast from "@/components/ui/Toast";

type Admin = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminManagementTab() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ================= LOAD ADMINS ================= */
  const loadAdmins = async () => {
    try {
      const res = await fetch("/api/admin/manage-admins");
      const data = await res.json();

      setAdmins(Array.isArray(data.admins) ? data.admins : []);
      setCurrentAdminId(data.currentAdminId);
    } catch {
      setToast({ message: "Failed to load admins", type: "error" });
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  /* ================= CREATE ADMIN ================= */
  const createAdmin = async () => {
    if (!email || !password) {
      setToast({ message: "Email and password are required", type: "error" });
      return;
    }

    const res = await fetch("/api/admin/manage-admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setToast({ message: "Failed to create admin", type: "error" });
      return;
    }

    setToast({ message: "Admin created successfully", type: "success" });
    setEmail("");
    setPassword("");
    loadAdmins();
  };

  /* ================= DELETE ADMIN ================= */
  const deleteAdmin = async (adminId: string) => {
    if (adminId === currentAdminId) {
      setToast({ message: "You cannot delete your own admin account", type: "error" });
      return;
    }

    if (!confirm("Are you sure you want to remove this admin?")) return;

    const res = await fetch("/api/admin/manage-admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: adminId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setToast({ message: data.message || "Failed to delete admin", type: "error" });
      return;
    }

    setToast({ message: "Admin deleted successfully", type: "success" });
    loadAdmins();
  };

  return (
    <div className="space-y-6 min-h-screen">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ➕ Create Admin */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#4ca626]">Create New Admin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4ca626] outline-none"
            />
            <input
              type="password"
              placeholder="Temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4ca626] outline-none"
            />
          </div>

          <button
            onClick={createAdmin}
            className="flex items-center gap-2 bg-[#4ca626] hover:bg-[#3f961f] text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={16} />
            Create Admin
          </button>
        </CardContent>
      </Card>

      {/* 📋 Admin List */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-[#4ca626] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => {
                const isSelf = admin.id === currentAdminId;
                return (
                  <tr key={admin.id} className="border-t hover:bg-green-50">
                    <td className="px-4 py-3 font-medium">
                      {admin.email}
                      {isSelf && (
                        <span className="ml-2 text-xs text-[#4ca626]">(You)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        disabled={isSelf}
                        title={isSelf ? "You cannot delete your own account" : "Remove admin"}
                        className={`p-2 rounded transition ${
                          isSelf
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-100"
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {admins.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    No admins found
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
