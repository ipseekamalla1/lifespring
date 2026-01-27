"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

type PatientForm = {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  bloodGroup: string;
  allergies: string;
};

export default function PatientDetailsTab() {
  const [patient, setPatient] = useState<PatientForm>({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    address: "",
    dateOfBirth: "",
    bloodGroup: "",
    allergies: "",
  });

  const [original, setOriginal] = useState<PatientForm | null>(null);
  const [editing, setEditing] = useState<keyof PatientForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/patient/profile")
      .then(res => res.json())
      .then(data => {
        const mapped = {
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          gender: data.gender ?? "",
          address: data.address ?? "",
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.split("T")[0]
            : "",
          bloodGroup: data.bloodGroup ?? "",
          allergies: data.allergies?.join(", ") ?? "",
        };
        setPatient(mapped);
        setOriginal(mapped);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  async function save(field: keyof PatientForm) {
    setSaving(true);

    const value =
      field === "allergies"
        ? patient[field].split(",").map(a => a.trim())
        : patient[field];

    const res = await fetch("/api/patient/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });

    setSaving(false);

    if (!res.ok) return toast.error("Update failed");

    setOriginal(patient);
    setEditing(null);
    toast.success("Profile updated");
  }

  function cancel(field: keyof PatientForm) {
    if (!original) return;
    setPatient(p => ({ ...p, [field]: original[field] }));
    setEditing(null);
  }

  function Field({ label, field }: { label: string; field: keyof PatientForm }) {
    return (
      <div>
        <Label>{label}</Label>
        <div className="flex gap-3 mt-1">
          <Input
            type={field === "dateOfBirth" ? "date" : "text"}
            value={patient[field]}
            disabled={editing !== field}
            onChange={e =>
              setPatient(p => ({ ...p, [field]: e.target.value }))
            }
            className="focus-visible:ring-[#4ca626]"
          />

          {editing === field ? (
            <>
              <Button
                size="icon"
                className="bg-[#4ca626]"
                onClick={() => save(field)}
                disabled={saving}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => cancel(field)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              variant="outline"
              onClick={() => setEditing(field)}
            >
              <Pencil className="h-4 w-4 text-[#4ca626]" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Section title="Personal Information">
        <Field label="First Name" field="firstName" />
        <Field label="Last Name" field="lastName" />
        <Field label="Date of Birth" field="dateOfBirth" />
        <Field label="Gender" field="gender" />
      </Section>

      <Section title="Contact Details">
        <Field label="Phone Number" field="phone" />
        <Field label="Address" field="address" />
      </Section>

      <Section title="Medical Information">
        <Field label="Blood Group" field="bloodGroup" />
        <Field label="Allergies (comma separated)" field="allergies" />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
