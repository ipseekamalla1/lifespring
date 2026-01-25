"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/patient/complete-profile", {
      method: "PUT", // ✅ MUST be PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        age: form.age ? Number(form.age) : null,
        allergies: form.allergies
          ? form.allergies.split(",").map(a => a.trim())
          : [],
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to complete profile");
      return;
    }

    router.push("/patient/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6faf3] px-4">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardContent className="p-8 space-y-5">
          <h2 className="text-2xl font-semibold text-center">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="firstName" placeholder="First Name" onChange={handleChange} required />
            <Input name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <Input name="age" type="number" placeholder="Age" onChange={handleChange} />

            {/* GENDER */}
            <select
              name="gender"
              className="w-full h-12 border rounded-md px-3"
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
              <option value="OTHER">Other</option>
            </select>

            <Input name="phone" placeholder="Phone" onChange={handleChange} />
            <Input name="address" placeholder="Address" onChange={handleChange} />

            {/* BLOOD GROUP */}
            <select
              name="bloodGroup"
              className="w-full h-12 border rounded-md px-3"
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A_POS">A+</option>
              <option value="A_NEG">A-</option>
              <option value="B_POS">B+</option>
              <option value="B_NEG">B-</option>
              <option value="AB_POS">AB+</option>
              <option value="AB_NEG">AB-</option>
              <option value="O_POS">O+</option>
              <option value="O_NEG">O-</option>
            </select>

            {/* ALLERGIES */}
            <Input
              name="allergies"
              placeholder="Allergies (comma separated)"
              onChange={handleChange}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ca626] text-white"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
