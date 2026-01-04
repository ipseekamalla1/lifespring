// app/api/doctor/patients/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params is async
) {
  const { id } = await params; 

  if (!id) {
    return NextResponse.json(
      { error: "Patient ID is required" },
      { status: 400 }
    );
  }

  try {
    // ================= GET DOCTOR =================
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "DOCTOR" | "PATIENT" | "ADMIN";
    };

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

    // ================= GET PATIENT =================
    const patient = await prisma.patient.findUnique({
      where: { id }, // must exist
      include: {
        user: { select: { email: true } }, // get patient email
        appointments: {
          where: { doctorId: doctor.id }, // only this doctor's appointments
          include: { doctor: true },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (err) {
    console.error("Doctor patient GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
