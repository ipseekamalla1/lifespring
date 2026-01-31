"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  LogOut,
  Stethoscope,
  CalendarCheck,
  BarChart3,
  User,
  Building2,
  Settings
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminSidebar() {
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
   <aside className="w-64 min-h-screen bg-black border-r border-slate-800 shadow-lg flex flex-col">
  {/* TOP */}
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

    {/* PANEL TITLE */}
    <h1 className="text-white font-bold text-lg mb-6 text-center">
      Admin Panel
    </h1>

    {/* NAV */}
    <nav className="space-y-1 w-full">
      {navItem("/admin/dashboard", "Dashboard", Home)}
      {navItem("/admin/doctors", "Doctors", Stethoscope)}
      {navItem("/admin/patients", "Patients", Users)}
      {navItem("/admin/appointments", "Appointments", CalendarCheck)}
      {navItem("/admin/departments", "Departments", Building2)}
      {navItem("/admin/users", "Users", User)}
      {navItem("/admin/reports", "Reports", BarChart3)}
      {navItem("/admin/settings", "Settings", Settings)}
    </nav>
  </div>

  {/* LOGOUT pinned at bottom */}
  <div className="p-6 mt-auto">
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
