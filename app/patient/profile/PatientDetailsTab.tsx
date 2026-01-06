"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

type PatientForm = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
};

export default function PatientDetailsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] =
    useState<keyof PatientForm | null>(null);

  const [patient, setPatient] = useState<PatientForm>({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [originalPatient, setOriginalPatient] =
    useState<PatientForm | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/patient/profile");
        if (!res.ok) throw new Error();

        const data = await res.json();

        const mapped = {
          name: data.name ?? "",
          age: data.age ? String(data.age) : "",
          gender: data.gender ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        };

        setPatient(mapped);
        setOriginalPatient(mapped);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(field: keyof PatientForm, value: string) {
    setPatient(prev => ({ ...prev, [field]: value }));
  }

  async function saveField(field: keyof PatientForm) {
    setSaving(true);

    const res = await fetch("/api/patient/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        field,
        value: field === "age" ? Number(patient.age) : patient[field],
      }),
    });

    setSaving(false);

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }

    setOriginalPatient(patient);
    setEditingField(null);
    toast.success("Profile updated");
  }

  function cancelEdit(field: keyof PatientForm) {
    if (!originalPatient) return;

    setPatient(prev => ({
      ...prev,
      [field]: originalPatient[field],
    }));
    setEditingField(null);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {(Object.keys(patient) as (keyof PatientForm)[]).map(field => (
        <div key={field} className="space-y-1">
          <Label className="capitalize">{field}</Label>

          <div className="flex gap-2 items-center">
            <Input
              value={patient[field]}
              disabled={editingField !== field}
              onChange={e => handleChange(field, e.target.value)}
            />

            {editingField === field ? (
              <>
                <Button size="icon" onClick={() => saveField(field)} disabled={saving}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => cancelEdit(field)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditingField(field)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
