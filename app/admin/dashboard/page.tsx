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


  const appointmentChartData = [
  {
    name: "Confirmed",
    value: stats?.confirmedAppointments ?? 0,
  },
  {
    name: "Pending",
    value: stats?.pendingAppointments ?? 0,
  },
  {
    name: "Cancelled",
    value: stats?.cancelledAppointments ?? 0,
  },
];

const COLORS = ["#10b981", "#facc15", "#ef4444"]; // emerald, yellow, red

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

      {/* INSIGHTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: RECENT APPOINTMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 rounded-2xl border border-emerald-100 bg-white p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            Recent Appointments
          </h2>

          <div className="space-y-4">
            {recentAppointments.length === 0 && (
              <p className="text-sm text-emerald-700/70">
                No recent appointments found.
              </p>
            )}

            {recentAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex justify-between items-center rounded-xl border border-emerald-100 p-4 hover:bg-emerald-50 transition"
              >
                <div>
                  <p className="font-medium text-emerald-900">
                    {appt.patient?.name ?? "Unknown Patient"}
                  </p>
                  <p className="text-xs text-emerald-700/70">
                    {new Date(appt.date).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      appt.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-800"
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
  <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-end">
    <Link
      href="/admin/appointments"
      className="
        text-sm font-medium text-emerald-700
        hover:text-emerald-900
        transition
      "
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
          className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
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
