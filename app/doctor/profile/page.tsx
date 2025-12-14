"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    specialization: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/doctor/me");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "An error occurred");
        } else {
          setDoctor(data);
          setForm({
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            department: data.department || "",
            specialization: data.specialization || "",
          });
        }
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/doctor/me", {
        method: "PUT",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
      } else {
        setDoctor(data.doctor);
        setEditing(false);
        setError(null);
      }
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <Card className="p-6">
      <CardContent>
        <h1 className="text-2xl font-bold mb-4">Doctor Profile</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            {editing ? (
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <p>{doctor?.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <p>{doctor?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            {editing ? (
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            ) : (
              <p>{doctor?.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Department</label>
            {editing ? (
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            ) : (
              <p>{doctor?.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Specialization</label>
            {editing ? (
              <Input
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
              />
            ) : (
              <p>{doctor?.specialization}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          {editing ? (
            <>
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={() => setEditing(false)} variant="outline">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
    