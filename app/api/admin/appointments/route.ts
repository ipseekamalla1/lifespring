import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/* ================= CREATE APPOINTMENT ================= */
export async function POST(req: Request) {
  try {
    /* ---------- AUTH ---------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- BODY ---------- */
    const { doctorId, patientId, date, reason } = await req.json();

    if (!doctorId || !patientId || !date || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- CREATE ---------- */
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: new Date(date),
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("POST appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
