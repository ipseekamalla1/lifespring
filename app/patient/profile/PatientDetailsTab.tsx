"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

/* =====================
   TYPES
===================== */
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

const BLOOD_GROUPS = [
  { label: "A+", value: "A_POS" },
  { label: "A-", value: "A_NEG" },
  { label: "B+", value: "B_POS" },
  { label: "B-", value: "B_NEG" },
  { label: "AB+", value: "AB_POS" },
  { label: "AB-", value: "AB_NEG" },
  { label: "O+", value: "O_POS" },
  { label: "O-", value: "O_NEG" },
];

/* =====================
   MAIN COMPONENT
===================== */
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientForm, string>>
  >({});

  /* =====================
     LOAD PROFILE
  ===================== */
  useEffect(() => {
    fetch("/api/patient/profile")
      .then(res => res.json())
      .then(data => {
        const mapped: PatientForm = {
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          gender: data.gender ?? "",
          address: data.address ?? "",
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.split("T")[0]
            : "",
          bloodGroup: data.bloodGroup ?? "",
          allergies: Array.isArray(data.allergies)
            ? data.allergies.join(",")
            : "",
        };

        setPatient(mapped);
        setOriginal(mapped);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  /* =====================
     VALIDATION
  ===================== */
  function validate(field: keyof PatientForm): boolean {
    let message = "";

    if (["firstName", "lastName", "gender", "bloodGroup"].includes(field)) {
      if (!patient[field]) message = "This field is required";
    }

    if (field === "phone" && !/^[0-9]{10}$/.test(patient.phone)) {
      message = "Phone number must be 10 digits";
    }

    if (field === "dateOfBirth" && patient.dateOfBirth) {
      if (new Date(patient.dateOfBirth) > new Date()) {
        message = "Date of birth cannot be in the future";
      }
    }

    setErrors(e => ({ ...e, [field]: message }));
    return !message;
  }

  /* =====================
     SAVE FIELD
  ===================== */
  async function save(field: keyof PatientForm) {
    if (!validate(field)) return;

    setSaving(true);

    const value =
      field === "allergies"
        ? patient.allergies
            .split(",")
            .map(a => a.trim())
            .filter(Boolean)
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
    setErrors({});
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="space-y-10">
      <Section title="Personal Information">
        <Field
          label="First Name"
          field="firstName"
          patient={patient}
          editing={editing}
          setEditing={setEditing}
          setPatient={setPatient}
          save={save}
          cancel={cancel}
          saving={saving}
          errors={errors}
        />
        <Field
          label="Last Name"
          field="lastName"
          {...commonProps()}
        />
        <Field
          label="Date of Birth"
          field="dateOfBirth"
          {...commonProps()}
        />
        <Field
          label="Gender"
          field="gender"
          {...commonProps()}
        />
      </Section>

      <Section title="Contact Details">
        <Field label="Phone Number" field="phone" {...commonProps()} />
        <Field label="Address" field="address" {...commonProps()} />
      </Section>

      <Section title="Medical Information">
        <Field label="Blood Group" field="bloodGroup" {...commonProps()} />
        <Field
          label="Allergies (comma separated)"
          field="allergies"
          {...commonProps()}
        />
      </Section>
    </div>
  );

  function commonProps() {
    return {
      patient,
      editing,
      setEditing,
      setPatient,
      save,
      cancel,
      saving,
      errors,
    };
  }
}

/* =====================
   FIELD (MOVED OUTSIDE!)
===================== */
function Field({
  label,
  field,
  patient,
  editing,
  setEditing,
  setPatient,
  save,
  cancel,
  saving,
  errors,
}: any) {
  const isEditing = editing === field;

  return (
    <div>
      <Label>{label}</Label>

      <div className="flex gap-3 mt-1">
        {field === "bloodGroup" ? (
          <select
            disabled={!isEditing}
            value={patient[field]}
            onChange={e =>
              setPatient((p: any) => ({ ...p, [field]: e.target.value }))
            }
            className="w-full h-10 rounded-md border px-3"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map(bg => (
              <option key={bg.value} value={bg.value}>
                {bg.label}
              </option>
            ))}
          </select>
        ) : field === "gender" ? (
          <select
            disabled={!isEditing}
            value={patient[field]}
            onChange={e =>
              setPatient((p: any) => ({ ...p, [field]: e.target.value }))
            }
            className="w-full h-10 rounded-md border px-3"
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        ) : (
          <Input
            value={patient[field]}
            type={field === "dateOfBirth" ? "date" : "text"}
            disabled={!isEditing}
            onChange={e =>
              setPatient((p: any) => ({ ...p, [field]: e.target.value }))
            }
          />
        )}

        {isEditing ? (
          <>
            <Button size="icon" onClick={() => save(field)} disabled={saving}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={() => cancel(field)}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="icon" variant="outline" onClick={() => setEditing(field)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {errors[field] && (
        <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
      )}
    </div>
  );
}

/* =====================
   SECTION
===================== */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
