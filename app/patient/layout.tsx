import { ReactNode } from "react";
import PatientSidebar from "@/components/patient/PatientSidebar";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <PatientSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
