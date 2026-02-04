"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Department = {
  id: string;
  name: string;
};

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    departmentId: "",
    specialization: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch doctor profile and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorRes = await fetch("/api/doctor/me");
        const doctorData = await doctorRes.json();
              console.log("Doctor data from API:", doctorData); // <-- LOG doctor


        const depRes = await fetch("/api/admin/departments");
        const depData = await depRes.json();
        setDepartments(depData);
              console.log("Departments from API:", depData); // <-- LOG departments


        // Map doctor's departmentId to department object
        const doctorDepartment = depData.find(
  (d: Department) => d.name === doctorData.department
);
console.log("Mapped doctor department:", doctorDepartment);


        setDoctor({
          ...doctorData,
          department: doctorDepartment || null,
        });

        setForm({
          name: doctorData.name || "",
          phone: doctorData.phone || "",
  departmentId: doctorDepartment?.id || "", 
          specialization: doctorData.specialization || "",
        });
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save profile changes
const saveProfile = async () => {
  setError(null);
  setSuccess(null);

  try {
    const res = await fetch("/api/doctor/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to save profile");

    // Merge email and map department
    const updatedDepartment = departments.find(
      dep => dep.id === form.departmentId
    );

    setDoctor({
      ...doctor, // keep existing email
      ...data.doctor, // updated fields from API
      department: updatedDepartment || null, // updated department object
    });

    setEditing(false);
    setSuccess("Profile updated successfully");
  } catch (err) {
    setError("Something went wrong");
  }
};


  // Change password
  const changePassword = async () => {
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("/api/doctor/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to change password");

      setSuccess("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Something went wrong");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading profile…</p>;

  return (
    <div className="max-w-4xl p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">Doctor Profile</h1>
        <p className="text-sm text-[#4ca626]">
          Manage your personal information and security
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-[#4ca626] text-[#4ca626]"
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
              {/* Name */}
              <div>
                <label className="text-sm font-medium">Full Name</label>
                {editing ? (
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-gray-800">{doctor.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="mt-1 text-gray-800">{doctor.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium">Phone</label>
                {editing ? (
                  <Input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-gray-800">{doctor.phone || "-"}</p>
                )}
              </div>

              {/* Department */}
<div>
  <label className="text-sm font-medium">Department</label>
  {editing ? (
    <select
      className="mt-1 w-full border rounded px-2 py-1"
      value={form.departmentId}
      onChange={e => setForm({ ...form, departmentId: e.target.value })}
    >
      <option value="">Select Department</option>
      {departments.map(dep => (
        <option key={dep.id} value={dep.id}>
          {dep.name}
        </option>
      ))}
    </select>
  ) : (
    <p className="mt-1 text-gray-800">
  {doctor.department?.name || "-"}
</p>

  )}
</div>



              {/* Specialization */}
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

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {editing ? (
                <>
                  <Button onClick={saveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button className="bg-[#4ca626]" onClick={() => setEditing(true)}>
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

            <Button className="bg-[#4ca626]" onClick={changePassword}>
              Update Password
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
