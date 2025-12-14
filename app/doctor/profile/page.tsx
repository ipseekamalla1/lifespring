"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Doctor Profile</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <div>
            <label>Name</label>
            {editing ? (
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            ) : (
              <p>{doctor.name}</p>
            )}
          </div>

          <div>
            <label>Email</label>
            <p>{doctor.email}</p>
          </div>

          <div>
            <label>Phone</label>
            {editing ? (
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            ) : (
              <p>{doctor.phone}</p>
            )}
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={saveProfile}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="text-xl font-bold">Change Password</h2>

          <Input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />

          <Input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />

          <Input
            type="password"
            placeholder="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />

          <Button onClick={changePassword}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
