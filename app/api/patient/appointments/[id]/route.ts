import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {prisma }from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ unwrap params FIRST
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Appointment ID missing" },
      { status: 400 }
    );
  }

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

  const appointment = await prisma.appointment.findUnique({
    where: { id }, // ✅ NOW VALID
  });

  if (!appointment || appointment.patientId !== patient.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  if (appointment.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Already cancelled" },
      { status: 400 }
    );
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json(updated);
}
