import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendAppointmentConfirmationEmail } from "@/lib/email";

/* =========================
   GET: Patient Appointments
========================= */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

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

/* =========================
   POST: Book Appointment
========================= */
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const body = await req.json();

  // 🔹 Get logged-in user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  // 🔹 Get patient
  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 401 });
  }

  // 🔹 Get doctor (for email)
  const doctor = await prisma.doctor.findUnique({
    where: { id: body.doctorId },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
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

    // 🔗 PDF URL
    const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/${appointment.id}/pdf`;

    // 📧 Send confirmation email
    await sendAppointmentConfirmationEmail({
      to: user.email,
      patientName: user.email.split("@")[0], // or user.name if exists
      doctorName: doctor.name,
      date: appointment.date,
      pdfUrl,
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    // 🚨 Slot already booked
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
