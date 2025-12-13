"use client";

import DoctorSidebar from "@/components/DoctorSideBar";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DoctorSidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        
        {children}
      </main>
    </div>
  );
}
