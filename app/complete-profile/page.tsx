"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Phone, MapPin, HeartPulse, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toast from "@/components/ui/Toast";

const steps = ["Basic Info", "Medical Info", "Photo"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genderOptions = [
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" },
  { label: "Other", value: "OTHER" },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    photoUrl: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  }

  function validateStepOne() {
    const newErrors: Record<string, string> = {};

    if (!form.gender) newErrors.gender = "Gender is required";
    if (form.phone && !/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
      newErrors.dateOfBirth = "DOB cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submitProfile() {
    if (!validateStepOne()) {
      setToast({ message: "Please fix the errors", type: "error" });
      return;
    }

    setLoading(true);

    // Map blood group to Prisma enum
    const bloodGroupMap: Record<string, string> = {
      "A+": "A_POS", "A-": "A_NEG",
      "B+": "B_POS", "B-": "B_NEG",
      "AB+": "AB_POS", "AB-": "AB_NEG",
      "O+": "O_POS", "O-": "O_NEG",
    };

    const res = await fetch("/api/patient/complete-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender,
        phone: form.phone || null,
        address: form.address || null,
        bloodGroup: form.bloodGroup ? bloodGroupMap[form.bloodGroup] : null,
        allergies: form.allergies ? form.allergies.split(",").map(a => a.trim()) : [],
        photoUrl: form.photoUrl || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setToast({ message: "Failed to save profile", type: "error" });
      return;
    }

    setToast({ message: "Profile completed successfully 🎉", type: "success" });
    setTimeout(() => {
      router.replace("/patient/dashboard");
      router.refresh();
    }, 1200);
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6faf3] to-[#eef6ea] px-4">
        <Card className="w-full max-w-xl rounded-3xl shadow-2xl">
          <CardContent className="p-8 space-y-6">

            {/* Progress */}
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-[#4ca626]" : "bg-gray-200"}`} />
              ))}
            </div>

            <h2 className="text-xl font-semibold text-center text-[#2f5d1f]">{steps[step]}</h2>

            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 0 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><Calendar size={16} /> Date of Birth</label>
                    <Input type="date" name="dateOfBirth" max={new Date().toISOString().split("T")[0]} onChange={handleChange} className="h-12 mt-1" />
                    {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><User size={16} /> Gender</label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {genderOptions.map(g => (
                        <button key={g.value} type="button" onClick={() => setForm({ ...form, gender: g.value })} className={`h-12 rounded-xl border transition font-medium ${form.gender === g.value ? "bg-[#4ca626] text-white border-[#4ca626]" : "bg-white hover:border-[#4ca626]"}`}>{g.label}</button>
                      ))}
                    </div>
                    {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><Phone size={16} /> Phone (10 digits)</label>
                    <Input name="phone" maxLength={10} placeholder="1234567890" onChange={handleChange} className="h-12 mt-1" />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><MapPin size={16} /> Address</label>
                    <Input name="address" placeholder="Your address" onChange={handleChange} className="h-12 mt-1" />
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><HeartPulse size={16} /> Blood Group</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {bloodGroups.map(bg => (
                        <button key={bg} type="button" onClick={() => setForm({ ...form, bloodGroup: bg })} className={`py-2 rounded-lg border text-sm font-medium ${form.bloodGroup === bg ? "bg-[#4ca626] text-white" : "bg-white hover:border-[#4ca626]"}`}>{bg}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Allergies</label>
                    <Input name="allergies" placeholder="e.g. peanuts, dust, pollen" onChange={handleChange} className="h-12 mt-1" />
                    <p className="text-xs text-gray-400 mt-1">Separate multiple allergies with commas</p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-600 space-y-3">
                  <p className="text-lg font-medium">Upload a profile photo</p>
                  <p className="text-sm text-gray-400">You can skip this for now</p>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              {step < 2 ? (
                <>
                  <Button variant="ghost" onClick={() => setStep(step + 1)}>Skip</Button>
                  <Button onClick={() => { if (step === 0 && !validateStepOne()) return; setStep(step + 1); }} className="bg-[#4ca626] text-white">Next</Button>
                </>
              ) : (
                <Button onClick={submitProfile} disabled={loading} className="w-full bg-[#4ca626] text-white">{loading ? "Saving..." : "Finish"}</Button>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
}
