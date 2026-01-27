import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export default function RecentAppointments({ appointments, onViewAll }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Appointments</h2>
        <Button
          size="sm"
          variant="outline"
          className="border-[#4ca626] text-[#4ca626]"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>

      <div className="overflow-x-auto bg-white border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#4ca626] text-white">
            <tr>
              {["Doctor", "Date", "Time", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.slice(0, 6).map(app => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-3">{app.doctor?.name || "—"}</td>
                <td className="px-4 py-3">{formatDate(app.date)}</td>
                <td className="px-4 py-3">{formatTime(app.date)}</td>
                <td className="px-4 py-3">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
