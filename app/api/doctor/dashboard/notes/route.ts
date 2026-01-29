import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/* =========================
   GET RECENT NOTES
========================= */
export async function GET() {
  try {
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

    const notes = await prisma.appointmentNote.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        appointment: {
          include: {
            patient: {
              select: { firstName: true,
    lastName: true, },
            },
          },
        },
      },
    });

    return NextResponse.json(
      notes.map(n => ({
        id: n.id,
        note: n.note,
        createdAt: n.createdAt,
        appointmentId: n.appointmentId,
        patientName: n.appointment.patient?.firstName ?? "Unknown",
      }))
    );
  } catch (error) {
    console.error("GET recent notes error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
