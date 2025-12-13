"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  User,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-10">
          Doctor Panel
        </h2>

        <nav className="space-y-3">
          <Link href="/doctor/dashboard" className="sidebar-link">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link href="/doctor/patients" className="sidebar-link">
            <Users size={18} />
            Patients
          </Link>

          <Link href="/doctor/appointments" className="sidebar-link">
            <CalendarDays size={18} />
            Appointments
          </Link>

          <Link href="/doctor/profile" className="sidebar-link">
            <User size={18} />
            Profile
          </Link>
        </nav>
      </div>

      <div className="p-6">
        <Button
          variant="destructive"
          className="w-full flex gap-2"
          onClick={logout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
