"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login"; // safest redirect
  };

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between p-6">
      {/* TOP */}
      <div>
        <h2 className="text-2xl font-bold mb-10 text-center">
          Doctor Panel
        </h2>

        <nav className="space-y-4">
          <Link
            href="/doctor/dashboard"
            className="flex items-center gap-3 text-gray-700 hover:text-black transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/doctor/patients"
            className="flex items-center gap-3 text-gray-700 hover:text-black transition"
          >
            <Users size={18} />
            Patients
          </Link>

          <Link
            href="/doctor/appointments"
            className="flex items-center gap-3 text-gray-700 hover:text-black transition"
          >
            <Calendar size={18} />
            Appointments
          </Link>

          <Link
            href="/doctor/profile"
            className="flex items-center gap-3 text-gray-700 hover:text-black transition"
          >
            <User size={18} />
            Profile
          </Link>
        </nav>
      </div>

      {/* LOGOUT */}
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </aside>
  );
}
