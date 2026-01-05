import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore =  await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "desc" },
      include: {
        patient: {
          select: {
            name: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            name: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}


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

    /* ---------- DATA ---------- */
    const { doctorId, patientId, date, reason } = await req.json();

    if (!doctorId || !patientId || !date || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    /* ---------- CHECK DOUBLE BOOKING ---------- */
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        status: {
          not: "CANCELLED",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Doctor already booked for this time slot" },
        { status: 409 }
      );
    }

    /* ---------- CREATE ---------- */
    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: appointmentDate,
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
