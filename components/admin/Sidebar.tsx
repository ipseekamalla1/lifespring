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
  Building2
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Settings } from "lucide-react";


export default function Sidebar() {
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
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
          ${
            active
              ? "bg-emerald-100 text-emerald-800 font-semibold"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-emerald-100 shadow-sm flex flex-col justify-between">
      {/* TOP */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-800 text-center mb-8">
          Admin Panel
        </h1>

        <nav className="space-y-2">
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

      {/* LOGOUT */}
      <div className="p-6">
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
