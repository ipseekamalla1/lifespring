"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Users, LogOut, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login"); // redirect after logout
  };

  return (
    <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>

        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-black">
            <Home size={18} /> Dashboard
          </Link>

          <Link href="/admin/doctors" className="flex items-center gap-2 text-gray-700 hover:text-black">
            <Stethoscope size={18} /> Doctors
          </Link>

          <Link href="/admin/patients" className="flex items-center gap-2 text-gray-700 hover:text-black">
            <Users size={18} /> Patients
          </Link>
        </nav>
      </div>

      <Button variant="destructive" className="mt-6" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
}
