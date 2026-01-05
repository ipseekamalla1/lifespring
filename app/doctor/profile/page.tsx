"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    department: "",
    specialization: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/doctor/me")
      .then(res => res.json())
      .then(data => {
        setDoctor(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          department: data.department || "",
          specialization: data.specialization || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/doctor/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    setDoctor(data.doctor);
    setEditing(false);
    setSuccess("Profile updated successfully");
  };

  const changePassword = async () => {
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("Passwords do not match");
    }

    const res = await fetch("/api/doctor/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    setSuccess("Password changed successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading) return <p className="p-6 text-gray-500">Loading profile…</p>;

  return (
    <div className="max-w-4xl p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">Doctor Profile</h1>
        <p className="text-sm text-emerald-700">
          Manage your personal information and security
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-gray-500"
          }`}
        >
          Profile Info
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2 font-medium ${
            activeTab === "security"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-gray-500"
          }`}
        >
          Security
        </button>
      </div>

      {/* ALERTS */}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                {editing ? (
                  <Input
                    value={form.name}
                    onChange={e =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-800">{doctor.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1 text-gray-800">{doctor.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Phone</label>
                {editing ? (
                  <Input
                    value={form.phone}
                    onChange={e =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {doctor.phone || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Department</label>
                {editing ? (
                  <Input
                    value={form.department}
                    onChange={e =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {doctor.department || "-"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Specialization</label>
                {editing ? (
                  <Input
                    value={form.specialization}
                    onChange={e =>
                      setForm({ ...form, specialization: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {doctor.specialization || "-"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {editing ? (
                <>
                  <Button onClick={saveProfile}>Save Changes</Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button  className="bg-emerald-700" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= SECURITY TAB ================= */}
      {activeTab === "security" && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-4 max-w-md">
            <h2 className="text-xl font-semibold">Change Password</h2>

            <Input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={e =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={e =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />

            <Input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={e =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Button className="bg-emerald-700" onClick={changePassword}>
              Update Password
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
