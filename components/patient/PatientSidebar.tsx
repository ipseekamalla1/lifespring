"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  CalendarCheck,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function PatientSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 shadow-lg flex flex-col justify-between">
      
      {/* TOP */}
      <div className="p-6">
        <h1 className="text-xl font-semibold text-white text-center mb-10 tracking-wide">
          Patient Panel
        </h1>

        <nav className="space-y-1">
          {navItem("/patient/dashboard", "Dashboard", Home)}
          {navItem("/patient/appointments", "Appointments", CalendarCheck)}
          {navItem("/patient/doctors", "Doctors", Stethoscope)}
          {navItem("/patient/profile", "My Profile", User)}
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="p-6 border-t border-slate-800">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600/90 hover:bg-red-600 text-white flex items-center gap-2 justify-center"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
