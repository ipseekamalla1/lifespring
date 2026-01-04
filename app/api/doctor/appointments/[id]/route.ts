import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is async
) {
  try {
    /* =====================
       1. UNWRAP PARAMS
    ====================== */
    const { id } = await params; // ✅ FIX

    /* =====================
       2. GET TOKEN
    ====================== */
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* =====================
       3. VERIFY JWT
    ====================== */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: "DOCTOR" | "PATIENT" | "ADMIN";
    };

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* =====================
       4. FIND DOCTOR
    ====================== */
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: decoded.id,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

    /* =====================
       5. FETCH APPOINTMENT
    ====================== */
    const appointment = await prisma.appointment.findFirst({
      where: {
        id, // ✅ SAFE NOW
        doctorId: doctor.id,
      },
      include: {
        patient: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (err) {
    console.error("Doctor appointment GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
