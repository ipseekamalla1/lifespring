"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Building2,
  Clock,
  ChevronRight,
  Search,
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: string;
  experience?: number;
};

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");

  useEffect(() => {
    fetch("/api/patient/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  /** 🔍 unique departments for filter */
  const departments = useMemo(() => {
    const list = doctors
      .map((d) => d.department)
      .filter(Boolean) as string[];
    return ["ALL", ...Array.from(new Set(list))];
  }, [doctors]);

  /** 🎯 filtered doctors */
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "ALL" || doc.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [doctors, search, department]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p className="text-sm text-gray-500">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">
          Our Doctors
        </h1>
        <p className="text-gray-600">
          Find the right specialist and book your appointment
        </p>
        <div className="h-1 w-14 bg-[#4ca626] rounded-full" />
      </div>

      {/* SEARCH + FILTER */}
<div className="rounded-2xl border border-[#4ca626]/20 bg-[#4ca626]/45 p-5 shadow-sm">
  <div className="flex flex-col md:flex-row gap-4">
    {/* SEARCH */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4ca626]" />
      <Input
        placeholder="Search doctor or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          pl-9
          bg-white
          border-[#4ca626]/40
          focus:border-[#4ca626]
          focus:ring-[#4ca626]/30
          text-gray-900
          placeholder:text-gray-400
        "
      />
    </div>

    {/* DEPARTMENT FILTER */}
    <div className="relative">
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="
          h-10
          rounded-md
          bg-white
          border border-[#4ca626]/40
          px-4
          text-sm
          text-gray-900
          focus:outline-none
          focus:ring-2
          focus:ring-[#4ca626]/30
          focus:border-[#4ca626]
          cursor-pointer
        "
      >
        {departments.map((dep) => (
          <option key={dep} value={dep}>
            {dep === "ALL" ? "All Departments" : dep}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>


      {/* EMPTY */}
      {filteredDoctors.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 bg-white">
          No doctors found for the selected criteria.
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doc) => (
          <Card
            key={doc.id}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* TOP ACCENT */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#4ca626]" />

            <CardContent className="p-6 space-y-6">
              {/* HEADER */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#4ca626]/15 flex items-center justify-center transition group-hover:bg-[#4ca626]">
                  <Stethoscope className="h-6 w-6 text-[#4ca626] group-hover:text-white transition" />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 leading-tight">
                    {doc.name}
                  </p>
                  <p className="text-sm text-[#4ca626]">
                    {doc.specialization || "General Physician"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 text-sm text-gray-600">
                {doc.department && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{doc.department}</span>
                  </div>
                )}

                {doc.experience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{doc.experience}+ years experience</span>
                  </div>
                )}
              </div>

              {/* ACTION */}
              <Button
                className="w-full flex items-center justify-center gap-2 bg-[#4ca626] hover:bg-[#449620] text-white transition"
                onClick={() =>
                  router.push(`/patient/doctors/${doc.id}`)
                }
              >
                View Profile
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
