"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  status: "Active" | "Inactive";
  patientsCount: number;
  experience: number;
  email: string;
  phone: string;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch("/api/admin/doctors")
      .then((res) => res.json())
      .then(setDoctors);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-emerald-800">
        Doctors
      </h1>

      <Card className="rounded-2xl border border-emerald-100 shadow-md">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-100 text-emerald-800">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Specialty</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Patients</th>
                <th className="px-4 py-3 text-left">Experience</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t hover:bg-emerald-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    {doc.name}
                  </td>

                  <td className="px-4 py-3">
                    {doc.specialty}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          doc.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {doc.patientsCount}
                  </td>

                  <td className="px-4 py-3">
                    {doc.experience} years
                  </td>

                  <td className="px-4 py-3 text-xs">
                    <p>{doc.email}</p>
                    <p className="text-gray-500">{doc.phone}</p>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/admin/doctors/${doc.id}`}
                      className="inline-flex p-2 rounded-lg hover:bg-emerald-100 text-emerald-700"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))}

              {doctors.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
