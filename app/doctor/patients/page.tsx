"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  CalendarDays,
  Stethoscope,
  Eye,
  Filter,
} from "lucide-react";

type Patient = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  appointments: {
    date: string;
    reason: string;
    status: string;
  }[];
};

const visitFilters = ["ALL", "WITH_VISITS", "NO_VISITS"] as const;

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visitFilter, setVisitFilter] =
    useState<typeof visitFilters[number]>("ALL");

  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/doctor/patients");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    let data = patients;

    // Visit filter
    if (visitFilter === "WITH_VISITS") {
      data = data.filter((p) => p.appointments.length > 0);
    }

    if (visitFilter === "NO_VISITS") {
      data = data.filter((p) => p.appointments.length === 0);
    }

    // Search
    if (!search) return data;

    const q = search.toLowerCase();
    return data.filter(
      (p) =>
        `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  }, [patients, search, visitFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-sm text-black">
        Loading patients…
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-black">My Patients</h1>
        <p className="text-sm text-[#4ca626]/80">
          Patients you have consulted or scheduled
        </p>
      </motion.div>

      {/* FILTER BAR */}
      <div className="bg-white border border-[#4ca626]/30 rounded-2xl p-5 shadow-md space-y-4">
        <input
          placeholder="Search by patient name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-[#4ca626]/50 text-[#4ca626]"
        />

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-[#4ca626]/70" />

          {visitFilters.map((f) => (
            <button
              key={f}
              onClick={() => setVisitFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-full border font-medium transition
                ${
                  visitFilter === f
                    ? "bg-[#4ca626] text-white border-[#4ca626]"
                    : "bg-white text-[#4ca626] border-[#4ca626]/30 hover:bg-[#4ca626]/10"
                }`}
            >
              {f === "ALL"
                ? "All"
                : f === "WITH_VISITS"
                ? "With Visits"
                : "No Visits"}
            </button>
          ))}
        </div>
      </div>

      {/* PATIENT LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPatients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-10 rounded-2xl border border-[#4ca626]/30 shadow-md text-center text-sm text-[#4ca626]/70"
            >
              No patients found
            </motion.div>
          )}

          {filteredPatients.map((patient, index) => {
            const lastVisit = patient.appointments[0];

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-2xl border border-[#4ca626]/30 shadow-md p-5 hover:shadow-lg transition relative"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  {/* LEFT */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-medium text-green">
                      <User size={18} />
                      {`${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Unnamed Patient"}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[#4ca626]/80">
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={15} />
                          {patient.phone}
                        </div>
                      )}

                      {lastVisit && (
                        <div className="flex items-center gap-1">
                          <CalendarDays size={15} />
                          {new Date(lastVisit.date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {lastVisit ? (
                      <p className="text-sm text-[#4ca626]/90">
                        <span className="font-medium text-[#4ca626]/80">
                          Last visit:
                        </span>{" "}
                        {lastVisit.reason}
                      </p>
                    ) : (
                      <p className="text-sm text-[#4ca626]/50">
                        No previous appointments
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2 text-[#4ca626] text-sm font-medium">
                    <Stethoscope size={16} />
                    Under your care
                  </div>
                </div>

                {/* VIEW BUTTON */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() =>
                      router.push(`/doctor/patients/${patient.id}`)
                    }
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4ca626] text-white rounded-lg text-sm hover:bg-[#3b8a1e] transition"
                  >
                    <Eye size={16} /> View
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
