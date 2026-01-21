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
  name: string | null;
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
        p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  }, [patients, search, visitFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-sm text-emerald-700">
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
        <h1 className="text-2xl font-semibold text-gray-900">
          My Patients
        </h1>
        <p className="text-sm text-gray-500">
          Patients you have consulted or scheduled
        </p>
      </motion.div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
        {/* Search */}
        <input
          placeholder="Search by patient name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none placeholder:text-gray-400"
        />

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400" />

          {visitFilters.map((f) => (
            <button
              key={f}
              onClick={() => setVisitFilter(f)}
              className={`px-4 py-1.5 text-xs rounded-full border transition
                ${
                  visitFilter === f
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
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

      {/* LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredPatients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-10 rounded-xl border shadow-sm text-center text-sm text-gray-500"
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
                className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition relative"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  {/* LEFT */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                      <User size={18} />
                      {patient.name || "Unnamed Patient"}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {patient.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={15} />
                          {patient.phone}
                        </div>
                      )}

                      {lastVisit && (
                        <div className="flex items-center gap-1">
                          <CalendarDays size={15} />
                          {new Date(
                            lastVisit.date
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {lastVisit ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">
                          Last visit:
                        </span>{" "}
                        {lastVisit.reason}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No previous appointments
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                    <Stethoscope size={16} />
                    Under your care
                  </div>
                </div>

                {/* VIEW BUTTON */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/doctor/patients/${patient.id}`
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"
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
