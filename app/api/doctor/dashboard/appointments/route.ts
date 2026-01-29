import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/* =========================
   GET RECENT APPOINTMENTS
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

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      orderBy: { date: "desc" },
      take: 5,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET recent appointments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
