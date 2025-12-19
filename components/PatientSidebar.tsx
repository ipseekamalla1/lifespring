"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Stethoscope,
  Calendar,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";


const menuItems = [
  {
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    href: "/patient/profile",
    icon: User,
  },
  {
    label: "Doctors",
    href: "/patient/doctors",
    icon: Stethoscope,
  },
  {
    label: "Appointments",
    href: "/patient/appointments",
    icon: Calendar,
  },
];



export default function PatientSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r bg-muted/40 px-6 py-8">
      <h2 className="mb-8 text-xl font-bold">Patient Panel</h2>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">
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
