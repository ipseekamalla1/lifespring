// /app/api/admin/appointments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/* ================= AUTH HELPER ================= */
async function authorizeAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  if (decoded.role !== "ADMIN") throw new Error("Forbidden");

  return decoded;
}

/* GET */
export async function GET() {
  try {
    await authorizeAdmin();

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: {
          include: { department: true },
        },
      },
      orderBy: { date: "desc" },
    });

    // Normalize response
    const normalized = appointments.map((a) => ({
      id: a.id,
      date: a.date,
      reason: a.reason,
      status: a.status,
      patient: {
        id: a.patient?.id || "",
        firstName: a.patient?.firstName || "",
        lastName: a.patient?.lastName || "",
        phone: a.patient?.phone || "",
      },
      doctor: {
        id: a.doctor?.id || "",
        name: a.doctor?.name || "",
        department: { name: a.doctor?.department?.name || "—" },
      },
    }));

    return NextResponse.json(normalized);
  } catch (error: any) {
    console.error("GET appointments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch appointments" },
      { status: error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500 }
    );
  }
}

/* POST */
export async function POST(req: Request) {
  try {
    await authorizeAdmin();
    const { doctorId, patientId, date, reason } = await req.json();

    if (!doctorId || !patientId || !date || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: new Date(date),
        reason,
        status: "PENDING",
      },
      include: { patient: true, doctor: { include: { department: true } } },
    });

    // Normalize
    const normalized = {
      id: appointment.id,
      date: appointment.date,
      reason: appointment.reason,
      status: appointment.status,
      patient: {
        id: appointment.patient?.id || "",
        firstName: appointment.patient?.firstName || "",
        lastName: appointment.patient?.lastName || "",
        phone: appointment.patient?.phone || "",
      },
      doctor: {
        id: appointment.doctor?.id || "",
        name: appointment.doctor?.name || "",
        department: { name: appointment.doctor?.department?.name || "—" },
      },
    };

    return NextResponse.json(normalized, { status: 201 });
  } catch (error: any) {
    console.error("POST appointment error:", error);
    return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 });
  }
}
