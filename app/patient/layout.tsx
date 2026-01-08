import { ReactNode } from "react";
import PatientSidebar from "@/components/patient/PatientSidebar";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
