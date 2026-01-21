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
  CONFIRMED: "bg-emerald-100 text-emerald-800",
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
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/patient/appointments", {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAppointments(data);
      } catch {
        setError("Unable to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
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

  if (loading) {
    return <div className="p-8 text-gray-500">Loading appointments...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">
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
              .then((data) => setAppointments(data))
              .finally(() => setLoading(false));
          }}
        />
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search by doctor or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as any)}
        >
          <SelectTrigger className="md:w-48">
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
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
            setActiveTab("ALL");
          }}
        >
          Clear Filters
        </Button>

        {/* TABS */}
        <div className="flex gap-2 ml-auto">
          {["ALL", "UPCOMING", "PAST"].map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "ghost"}
              className="rounded-full px-4"
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "ALL"
                ? "All"
                : tab === "UPCOMING"
                ? "Upcoming"
                : "Past"}
            </Button>
          ))}
        </div>
      </div>

      {/* LIST */}
      {filteredAppointments.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No appointments found
        </div>
      )}

      <div className="grid gap-5">
        {filteredAppointments.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-emerald-800">
                  {a.doctor.name ?? "Doctor"}
                </p>

                <p className="text-sm text-gray-600">
                  {a.doctor.specialization ?? "General"}
                  {a.doctor.department?.name &&
                    ` • ${a.doctor.department.name}`}
                </p>

                <p className="text-sm">
                  📅 {new Date(a.date).toLocaleString()}
                </p>

                <p className="text-sm">
                  <span className="font-medium">Reason:</span>{" "}
                  {a.reason}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <Badge className={statusStyle[a.status]}>
                  {a.status}
                </Badge>

                <Link href={`/patient/appointments/${a.id}`}>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
