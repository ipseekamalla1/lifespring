"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChangePasswordTab() {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Inline error state for form validation
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });

    // ---------- frontend validations ----------
    let hasError = false;
    if (!currentPassword) {
      setErrors(prev => ({ ...prev, currentPassword: "Current password is required" }));
      hasError = true;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrors(prev => ({ ...prev, newPassword: "New password must be at least 8 characters" }));
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      hasError = true;
    }
    if (hasError) return;
    // -------------------------------------------

    setLoading(true);

    try {
      const res = await fetch("/api/patient/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ Show specific error from API if current password is wrong
        toast.error(data?.message || "Failed to update password");

        // If current password is wrong, also set inline error
        if (data?.message === "Current password is incorrect") {
          setErrors(prev => ({ ...prev, currentPassword: "Current password is incorrect" }));
        }

        return;
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-ful bg-emerald-700">
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
