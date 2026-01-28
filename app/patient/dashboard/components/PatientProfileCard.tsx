import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Droplet, Phone, MapPin } from "lucide-react";



const bloodGroupMap: Record<string, string> = {
  A_POS: "A+",
  A_NEG: "A−",
  B_POS: "B+",
  B_NEG: "B−",
  AB_POS: "AB+",
  AB_NEG: "AB−",
  O_POS: "O+",
  O_NEG: "O−",
};

export default function PatientProfileCard({ patient }: { patient: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-3"
    >
<Card className="h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="h-2 w-full bg-[#4ca626]" />
        <CardContent className="p-6 space-y-6">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4ca626]/15 flex items-center justify-center">
              <User className="w-5 h-5 text-[#4ca626]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {patient?.firstName || "Patient"}
              </h2>
              {patient?.gender && (
                <p className="text-sm text-gray-500">{patient.gender}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
           {patient?.bloodGroup && (
  <div className="flex gap-2">
    <Droplet className="w-4 h-4 text-[#4ca626]" />
    Blood Group: {bloodGroupMap[patient.bloodGroup] ?? patient.bloodGroup}
  </div>
)}

            {patient?.phone && (
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-[#4ca626]" />
                {patient.phone}
              </div>
            )}
            {patient?.address && (
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-[#4ca626]" />
                {patient.address}
              </div>
            )}
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
