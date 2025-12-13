"use client";

import DoctorSidebar from "@/components/DoctorSidebar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DoctorSidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}
