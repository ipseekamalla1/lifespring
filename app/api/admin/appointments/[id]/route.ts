import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendAppointmentStatusEmail } from "@/lib/email";

const ALLOWED_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    /* ---------- PARAMS ---------- */
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID missing" },
        { status: 400 }
      );
    }

    /* ---------- AUTH ---------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!["ADMIN", "DOCTOR"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ---------- BODY ---------- */
    const { status } = await req.json();

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid appointment status" },
        { status: 400 }
      );
    }

    /* ---------- FETCH FULL APPOINTMENT ---------- */
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    /* ---------- UPDATE STATUS ---------- */
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    /* ---------- SEND STATUS EMAIL ---------- */
const pdfUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/${updatedAppointment.id}/pdf`;

await sendAppointmentStatusEmail({
  to: appointment.patient.user.email,
  patientName: appointment.patient.firstName?? "Patient", 
  doctorName: appointment.doctor.name ?? "Doctor",
  status,
  date: updatedAppointment.date,
  pdfUrl, // ✅ added
});


    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
