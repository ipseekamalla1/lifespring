"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ================= TOAST ================= */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded text-white shadow
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
}

export default function ProfileTab() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.email);
        setLoading(false);
      })
      .catch(() => {
        setToast({ message: "Failed to load profile", type: "error" });
        setLoading(false);
      });
  }, []);

  /* ---------- UPDATE EMAIL ---------- */
  async function saveEmail() {
    setSavingEmail(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToast({ message: "Email updated successfully", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSavingEmail(false);
    }
  }

  /* ---------- CHANGE PASSWORD ---------- */
  async function changePassword() {
    setSavingPassword(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCurrentPassword("");
      setNewPassword("");
      setToast({ message: "Password changed successfully", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Card>
        <CardContent className="p-6 space-y-8">
          <h2 className="text-lg font-semibold">Admin Profile</h2>

          {/* EMAIL */}
          <div className="space-y-2 max-w-md">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={saveEmail} disabled={savingEmail}>
                {savingEmail ? "Saving..." : "Save Email"}
              </Button>
            </div>
          </div>

          <hr />

          {/* PASSWORD */}
          <div className="space-y-4 max-w-md">
            <h3 className="font-medium">Change Password</h3>

            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={changePassword} disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
