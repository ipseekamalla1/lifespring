"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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

  // 🔹 Load admins + current admin
  const loadAdmins = async () => {
    try {
      const res = await fetch("/api/admin/manage-admins");
      const data = await res.json();

      setAdmins(Array.isArray(data.admins) ? data.admins : []);
      setCurrentAdminId(data.currentAdminId);
    } catch {
      toast.error("Failed to load admins");
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  // 🔹 Create admin
  const createAdmin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    const res = await fetch("/api/admin/manage-admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      toast.error("Failed to create admin");
      return;
    }

    toast.success("Admin created successfully");
    setEmail("");
    setPassword("");
    loadAdmins();
  };

  // 🔹 Delete admin (with self protection)
  const deleteAdmin = async (adminId: string) => {
    if (adminId === currentAdminId) {
      toast.error("You cannot delete your own admin account");
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
      toast.error(data.message || "Failed to delete admin");
      return;
    }

    toast.success("Admin deleted successfully");
    loadAdmins();
  };

  return (
    <div className="space-y-6">
      {/* ➕ Create Admin */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Create New Admin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Temporary password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={createAdmin}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Create Admin
          </button>
        </CardContent>
      </Card>

      {/* 📋 Admin List */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => {
                const isSelf = admin.id === currentAdminId;

                return (
                  <tr
                    key={admin.id}
                    className="border-t hover:bg-emerald-50"
                  >
                    <td className="p-4">
                      {admin.email}
                      {isSelf && (
                        <span className="ml-2 text-xs text-emerald-600">
                          (You)
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-xs text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "You cannot delete your own account"
                            : "Remove admin"
                        }
                        className={`p-2 rounded 
                          ${
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
                  <td
                    colSpan={3}
                    className="p-6 text-center text-gray-500"
                  >
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
