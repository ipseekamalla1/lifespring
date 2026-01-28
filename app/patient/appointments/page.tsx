"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import BookAppointmentModal from "@/components/patient/BookAppointmentModal";
import { FileText } from "lucide-react";


type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Appointment = {
  id: string;
  date: string;
  reason: string;
  status: AppointmentStatus;
  doctor: {
    name: string | null;
    specialization: string | null;
    department: { name: string } | null;
  };
};

const statusStyle: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-[#4ca626]/10 text-[#4ca626]",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | AppointmentStatus>("ALL");
  const [activeTab, setActiveTab] =
    useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  useEffect(() => {
    fetch("/api/patient/appointments", { credentials: "include" })
      .then((res) => res.json())
      .then(setAppointments)
      .catch(() => setError("Unable to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.reason.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || a.status === statusFilter;

    const isUpcoming = new Date(a.date) >= now;

    const matchesTab =
      activeTab === "ALL"
        ? true
        : activeTab === "UPCOMING"
        ? isUpcoming
        : !isUpcoming;

    return matchesSearch && matchesStatus && matchesTab;
  });

  if (loading)
    return <div className="p-8 text-gray-500">Loading appointments...</div>;

  if (error)
    return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your medical visits
          </p>
        </div>

        <BookAppointmentModal
          onSuccess={() => {
            setLoading(true);
            fetch("/api/patient/appointments", {
              credentials: "include",
            })
              .then((res) => res.json())
              .then(setAppointments)
              .finally(() => setLoading(false));
          }}
        />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow">
        <Input
          placeholder="Search by doctor or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2 border-gray-300 focus-visible:ring-[#4ca626]"
        />

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as any)}
        >
          <SelectTrigger className="md:w-48 border-gray-300 focus:ring-[#4ca626]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="outline"
          className="border-[#4ca626] text-[#4ca626] hover:bg-[#4ca626]/10"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
            setActiveTab("ALL");
          }}
        >
          Clear Filters
        </Button>

        {/* TABS (FIXED — no black fallback) */}
        <div className="flex gap-2 ml-auto">
          {["ALL", "UPCOMING", "PAST"].map((tab) => {
            const isActive = activeTab === tab;

            return (
              <Button
                key={tab}
                size="sm"
                variant="outline"
                className={
                  isActive
                    ? "bg-[#4ca626] text-white border-[#4ca626] hover:bg-[#449521]"
                    : "border-gray-300 text-gray-600 hover:border-[#4ca626] hover:text-[#4ca626] hover:bg-[#4ca626]/10"
                }
                onClick={() => setActiveTab(tab as any)}
              >
                {tab === "ALL"
                  ? "All"
                  : tab === "UPCOMING"
                  ? "Upcoming"
                  : "Past"}
              </Button>
            );
          })}
        </div>
      </div>

      {/* EMPTY */}
      {filteredAppointments.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No appointments found
        </div>
      )}

      {/* CARDS — IMPROVED */}
      <div className="grid gap-6">
        {filteredAppointments.map((a) => (
          <div
            key={a.id}
            className="relative rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-xl transition"
          >
            {/* Accent strip */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-[#4ca626]" />

            <div className="flex flex-col md:flex-row justify-between gap-6 pl-3">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#4ca626]">
                  {a.doctor.name ?? "Doctor"}
                </p>

                <p className="text-sm text-gray-600">
                  {a.doctor.specialization ?? "General"}
                  {a.doctor.department?.name &&
                    ` • ${a.doctor.department.name}`}
                </p>

                <p className="text-sm text-gray-700">
                  📅{" "}
                  {new Date(a.date).toLocaleDateString()} •{" "}
                  {new Date(a.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-sm text-gray-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {a.reason}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge className={statusStyle[a.status]}>
                  {a.status}
                </Badge>

                <Link href={`/patient/appointments/${a.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#4ca626] text-[#4ca626] hover:bg-[#4ca626]/10"
                  >
                    View Details
                  </Button>
                </Link>
                {a.status === "CONFIRMED" && (
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-gray-700 hover:border-[#4ca626] hover:text-[#4ca626]"
        onClick={() =>
          window.open(
            `/api/appointments/${a.id}/pdf`,
            "_blank"
          )
        }
      >
        <FileText className="h-4 w-4 mr-1" />
        PDF
      </Button>
    )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
