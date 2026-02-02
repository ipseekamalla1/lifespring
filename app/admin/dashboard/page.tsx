"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserRound, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/dashboard");
      const text = await res.text();
      if (!text) return;
      setStats(JSON.parse(text));
    };

    const fetchRecent = async () => {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) return;
      const data = await res.json();
      setRecentAppointments(data.slice(0, 5));
    };

    fetchStats();
    fetchRecent();
  }, []);

  const cards = [
    {
      title: "Doctors",
      value: stats?.totalDoctors,
      icon: UserRound,
      gradient: "from-[#4ca626] to-green-700",
    },
    {
      title: "Patients",
      value: stats?.totalPatients,
      icon: Users,
      gradient: "from-green-600 to-[#4ca626]",
    },
    {
      title: "Appointments",
      value: stats?.totalAppointments,
      icon: CalendarCheck,
      gradient: "from-teal-500 to-[#4ca626]",
    },
    {
      title: "Pending",
      value: stats?.pendingAppointments,
      icon: Clock,
      gradient: "from-lime-500 to-[#4ca626]",
    },
  ];

  const appointmentChartData = [
    { name: "Confirmed", value: stats?.confirmedAppointments ?? 0 },
    { name: "Pending", value: stats?.pendingAppointments ?? 0 },
    { name: "Cancelled", value: stats?.cancelledAppointments ?? 0 },
  ];

  const COLORS = ["#4ca626", "#facc15", "#ef4444"]; // green, yellow, red

  return (
    <div className="space-y-10 p-6 min-h-screen bg-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-[#4ca626]">
          Admin Dashboard
        </h1>
        <p className="text-green-700/80 mt-1">
          Hi Admin! Here's what's happening today
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
              <Card className="relative overflow-hidden rounded-2xl border border-green-200 bg-white shadow-md hover:shadow-xl transition-all">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-[0.08]`}
                />

                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-800/70">{card.title}</p>
                    <h2 className="text-4xl font-bold text-green-900">
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

      {/* INSIGHTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: RECENT APPOINTMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 rounded-2xl border border-green-200 bg-white p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Recent Appointments
          </h2>

          <div className="space-y-4">
            {recentAppointments.length === 0 && (
              <p className="text-sm text-green-700/70">
                No recent appointments found.
              </p>
            )}

            {recentAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex justify-between items-center rounded-xl border border-green-100 p-4 hover:bg-green-50 transition"
              >
                <div>
                  <p className="font-medium text-green-900">
                    {appt.patient?.firstName ?? "Unknown Patient"}
                  </p>
                  <p className="text-xs text-green-700/70">
                    {new Date(appt.date).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      appt.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : appt.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  `}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>

          {recentAppointments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200 flex justify-end">
              <Link
                href="/admin/appointments"
                className="text-sm font-medium text-green-800 hover:text-green-900 transition"
              >
                View all appointments →
              </Link>
            </div>
          )}

        </motion.div>

        {/* RIGHT: OVERVIEW CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-green-200 bg-white p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            System Overview
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appointmentChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {appointmentChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
