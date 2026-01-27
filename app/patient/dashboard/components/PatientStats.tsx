import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarDays, Stethoscope, ListChecks } from "lucide-react";

export default function PatientStats({ appointments }: { appointments: any[] }) {
  const upcoming = appointments.filter(a => a.status === "CONFIRMED");
  const doctorsCount = new Set(
    appointments.map(a => a.doctor?.name).filter(Boolean)
  ).size;

  const stats = [
    { label: "Total Appointments", value: appointments.length, icon: CalendarDays },
    { label: "Doctors Consulted", value: doctorsCount, icon: Stethoscope },
    { label: "Upcoming", value: upcoming.length, icon: ListChecks },
  ];

  return (
    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item, i) => (
        <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative bg-white border rounded-xl shadow-sm">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#4ca626]" />
            <CardContent className="flex justify-between py-6 pl-6">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
              <item.icon className="w-6 h-6 text-[#4ca626]" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
