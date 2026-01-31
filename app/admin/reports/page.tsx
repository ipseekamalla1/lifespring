"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";

const COLORS = ["#facc15", "#22c55e", "#ef4444"];

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data)
    return <p className="p-6 text-[#4ca626] font-medium">Loading reports…</p>;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-[#4ca626]">
          Reports & Analytics
        </h1>
        <p className="text-sm text-gray-500">Real-time hospital insights</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Doctors" value={data.kpis.totalDoctors} />
        <StatCard title="Total Patients" value={data.kpis.totalPatients} />
        <StatCard title="Total Appointments" value={data.kpis.totalAppointments} />
      </div>

      {/* PIE + BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#4ca626]">
              Appointment Status
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.appointmentStatus}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {data.appointmentStatus.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BAR */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#4ca626]">
              Users Overview
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.usersOverview}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4ca626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* LINE */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#4ca626]">
            Appointment Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.appointmentTrend}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#4ca626"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* ===== KPI CARD ===== */
function StatCard({ title, value }: any) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{title}</p>
          <FileBarChart size={18} className="text-[#4ca626]" />
        </div>
        <h2 className="text-3xl font-bold text-[#4ca626]">{value}</h2>
      </CardContent>
    </Card>
  );
}
