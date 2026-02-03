"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  CalendarCheck,
  Users,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DoctorSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Doctor info state
  const [doctor, setDoctor] = useState<{ name: string } | null>(null);

  // Fetch logged-in doctor info
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch("/api/doctor/profile");
        if (!res.ok) throw new Error("Failed to fetch doctor");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctor();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const navItem = (href: string, label: string, Icon: any) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
          ${
            active
              ? "bg-emerald-600/15 text-emerald-400 font-semibold"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
      >
        <Icon size={18} />
        <span className="text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-slate-800 shadow-lg flex flex-col">
      <div className="p-6 flex flex-col items-center">
        {/* LOGO */}
        <div className="mb-4 w-24 h-24 relative rounded-full overflow-hidden border border-slate-700 bg-slate-900">
          <Image
            src="/images/logo2.png"
            alt="Company Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* DOCTOR NAME */}
        <h2 className="text-white font-semibold text-lg mb-1 text-center">
          {doctor ? `Dr. ${doctor.name}` : "Loading..."}
        </h2>

        <p className="text-xs text-slate-400 mb-6 flex items-center gap-1">
          <Stethoscope size={14} />
          Doctor Panel
        </p>

        {/* NAV */}
        <nav className="space-y-1 w-full mb-6">
          {navItem("/doctor/dashboard", "Dashboard", Home)}
          {navItem("/doctor/appointments", "Appointments", CalendarCheck)}
          {navItem("/doctor/patients", "My Patients", Users)}
          {navItem("/doctor/profile", "My Profile", User)}
        </nav>

        {/* LOGOUT */}
        <Button
          onClick={handleLogout}
          className="w-full bg-[#4ca626] hover:bg-emerald-600 text-white flex items-center gap-2 justify-center"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
