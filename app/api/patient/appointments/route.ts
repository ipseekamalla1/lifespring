import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {prisma }from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendAppointmentConfirmationEmail } from "@/lib/email";


export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  // ✅ Find patient by userId
  const patient = await prisma.patient.findUnique({
    where: { userId: decoded.id },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: {
        select: {
          name: true,
          department: true,
          specialization: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(appointments);
}
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const body = await req.json();

  const patient = await prisma.patient.findUnique({
    where: { userId: decoded.id },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 401 });
  }

  const appointmentDate = new Date(body.date);

  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: body.doctorId,
        date: appointmentDate,
        reason: body.reason,
      },
    });
const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/${appointment.id}/pdf`;

await sendAppointmentConfirmationEmail({
  to: user.email,
  patientName: user.name,
  doctorName: doctor.name,
  date: appointment.date,
  pdfUrl,
});

    

    return NextResponse.json(appointment);
  } catch (error: any) {
    // 🚨 SLOT ALREADY TAKEN
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}

