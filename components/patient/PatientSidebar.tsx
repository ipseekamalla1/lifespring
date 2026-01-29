"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, CalendarCheck, User, LogOut, Stethoscope } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function PatientSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // State to store patient info
  const [patient, setPatient] = useState<{ firstName: string; lastName: string } | null>(null);

  // Fetch patient info on mount
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch("/api/patient/profile"); // your API route to get logged-in patient
        if (!res.ok) throw new Error("Failed to fetch patient");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatient();
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

    {/* PATIENT NAME */}
    <h2 className="text-white font-semibold text-lg mb-6 text-center">
      {patient ? `${patient.firstName} ${patient.lastName}` : "Loading..."}
    </h2>

    {/* NAV */}
    <nav className="space-y-1 w-full mb-6">
      {navItem("/patient/dashboard", "Dashboard", Home)}
      {navItem("/patient/appointments", "Appointments", CalendarCheck)}
      {navItem("/patient/doctors", "Doctors", Stethoscope)}
      {navItem("/patient/profile", "My Profile", User)}
    </nav>

    {/* LOGOUT (NOW CLOSE TO NAV) */}
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
