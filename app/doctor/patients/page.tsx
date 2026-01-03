"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Phone,
  CalendarDays,
  Stethoscope,
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

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      p =>
        p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q)
    );
  }, [patients, search]);

  if (loading) {
    return <div className="p-8 text-emerald-700">Loading patients…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-emerald-900">
          My Patients
        </h1>
        <p className="text-sm text-emerald-700">
          Patients you have consulted or scheduled
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm">
        <input
          placeholder="Search patient name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredPatients.length === 0 && (
          <div className="bg-white p-6 rounded-2xl border shadow-sm text-center text-gray-500">
            No patients found
          </div>
        )}

        {filteredPatients.map((patient, index) => {
          const lastVisit = patient.appointments[0];

          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <User size={18} />
                    {patient.name || "Unnamed Patient"}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {patient.phone && (
                      <div className="flex items-center gap-1">
                        <Phone size={16} />
                        {patient.phone}
                      </div>
                    )}

                    {lastVisit && (
                      <div className="flex items-center gap-1">
                        <CalendarDays size={16} />
                        {new Date(lastVisit.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {lastVisit && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Last visit:</span>{" "}
                      {lastVisit.reason}
                    </p>
                  )}
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <Stethoscope size={16} />
                  Under your care
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
