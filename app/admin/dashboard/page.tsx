"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserRound,
  CalendarCheck,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/dashboard");
      const text = await res.text();
      if (!text) return;
      setStats(JSON.parse(text));
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Doctors",
      value: stats?.totalDoctors,
      icon: UserRound,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Patients",
      value: stats?.totalPatients,
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Appointments",
      value: stats?.totalAppointments,
      icon: CalendarCheck,
      gradient: "from-teal-500 to-emerald-600",
    },
    {
      title: "Pending",
      value: stats?.pendingAppointments,
      icon: Clock,
      gradient: "from-lime-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-10 p-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-emerald-800">
          Admin Dashboard
        </h1>
        <p className="text-emerald-700/70 mt-1">
          Healthcare system overview
        </p>
      </motion.div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-md hover:shadow-xl transition-all">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-[0.08]`}
                />

                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-emerald-700/70">
                      {card.title}
                    </p>
                    <h2 className="text-4xl font-bold text-emerald-900">
                      {card.value ?? "—"}
                    </h2>
                  </div>

                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
                  >
                    <Icon size={28} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* INSIGHTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-md"
      >
       
      </motion.div>
    </div>
  );
}
