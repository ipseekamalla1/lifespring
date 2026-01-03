import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    /* ---------- AUTH ---------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- GET DOCTOR ---------- */
    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id }, // ✅ USER → DOCTOR
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    /* ---------- FETCH PATIENTS ---------- */
    const patients = await prisma.patient.findMany({
      where: {
        appointments: {
          some: {
            doctorId: doctor.id, // ✅ CORRECT ID
          },
        },
      },
      include: {
        appointments: {
          where: { doctorId: doctor.id },
          orderBy: { date: "desc" },
          take: 1,
          select: {
            date: true,
            reason: true,
            status: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Doctor patients error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
