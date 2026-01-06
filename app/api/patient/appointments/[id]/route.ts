import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;


  if (!id) {
    return NextResponse.json(
      { error: "Appointment ID missing" },
      { status: 400 }
    );
  }

  try {
    // 🔐 AUTH
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    // ✅ FIND PATIENT
    const patient = await prisma.patient.findUnique({
      where: { userId: decoded.id },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 401 }
      );
    }

    // 🔒 FETCH APPOINTMENT (OWNERSHIP CHECK)
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
        prescriptions: {
          orderBy: { createdAt: "desc" },
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
  } catch (error) {
    console.error("APPOINTMENT_DETAILS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
