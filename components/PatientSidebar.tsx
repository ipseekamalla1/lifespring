"use client";

import {
  LayoutDashboard,
  User,
  Stethoscope,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "Doctors", icon: Stethoscope },
  { label: "Appointments", icon: Calendar },
];

export default function PatientSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 px-6 py-8">
      <h2 className="mb-8 text-xl font-bold">Patient Panel</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </div>
        ))}
      </nav>

      <div className="mt-10">
        <Button variant="destructive" className="w-full gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
