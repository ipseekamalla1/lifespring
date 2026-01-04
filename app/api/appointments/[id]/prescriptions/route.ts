import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/* =========================
   GET PRESCRIPTIONS
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ✅ FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string; role: string };

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: {
        appointmentId: id,
        doctorId: doctor.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("GET prescriptions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* =========================
   ADD PRESCRIPTION
========================= */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ✅ FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string; role: string };

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

    const {
      medication,
      dosage,
      frequency,
      duration,
      instructions,
    } = await req.json();

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId: id,
        doctorId: doctor.id,
        medication,
        dosage,
        frequency,
        duration,
        instructions,
      },
    });

    return NextResponse.json(prescription);
  } catch (error) {
    console.error("POST prescription error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
