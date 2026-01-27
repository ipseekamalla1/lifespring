"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "./components/DashboardHeader";
import PatientProfileCard from "./components/PatientProfileCard";
import PatientStats from "./components/PatientStats";
import RecentAppointments from "./components/RecentAppointments";
import DashboardLoader from "./components/DashboardLoader";
import RecommendedDoctors from "./components/RecommendedDoctors";


type Patient = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
};

type Appointment = {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  doctor: { name: string | null };
};


type Doctor = {
  id: string;
  name: string;
  specialization?: string;
  department?: {
    name: string;
  } | null;
  experience?: number;
};



export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      const profileRes = await fetch("/api/patient/profile");
      setPatient(await profileRes.json());

      const appRes = await fetch("/api/patient/appointments");
      const data = await appRes.json();
      setAppointments(Array.isArray(data) ? data : []);

      const doctorsRes = await fetch("/api/patient/doctors");
      const doctorsData = await doctorsRes.json();
      setDoctors(Array.isArray(doctorsData) ? doctorsData.slice(0, 3) : []);


      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <DashboardLoader />;

  return (
  <div className="p-8 max-w-7xl mx-auto space-y-10 bg-gray-50/50">

    {/* ===== WELCOME SECTION ===== */}
    <DashboardHeader firstName={patient?.firstName} />

    {/* ===== PROFILE + STATS ===== */}
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <PatientProfileCard patient={patient} />
      <PatientStats appointments={appointments} />
    </div>

    {/* ===== RECENT APPOINTMENTS ===== */}
    <RecentAppointments
      appointments={appointments}
      onViewAll={() => router.push("/patient/appointments")}
    />

    {/* ===== RECOMMENDED DOCTORS ===== */}
    <RecommendedDoctors
      doctors={doctors}
      onViewAll={() => router.push("/patient/doctors")}
    />

  </div>
);

}
