"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Building2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: { name: string } | null;
  experience?: number;
};

export default function RecommendedDoctors({
  doctors,
  onViewAll,
}: {
  doctors: Doctor[];
  onViewAll: () => void;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recommended Doctors
        </h2>

        <Button
          size="sm"
          variant="outline"
          className="border-[#4ca626] text-[#4ca626] hover:bg-[#4ca626]/10"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#4ca626] rounded-l-xl" />

              <CardContent className="p-6 space-y-4">
                {/* HEADER */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4ca626]/15 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-[#4ca626]" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Dr. {doc.name}
                    </p>
                    <p className="text-sm text-[#4ca626]">
                      {doc.specialization || "General Physician"}
                    </p>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-1 text-sm text-gray-600">
                  {doc.department?.name && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {doc.department.name}
                    </div>
                  )}

                  {doc.experience !== undefined && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {doc.experience}+ years experience
                    </div>
                  )}
                </div>

                {/* ACTION */}
                <Button
                  size="sm"
                  className="w-full bg-[#4ca626] hover:bg-[#3e8f20]"
                  onClick={() =>
                    router.push(`/patient/doctors/${doc.id}`)
                  }
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {doctors.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No recommended doctors available
          </div>
        )}
      </div>
    </motion.div>
  );
}
