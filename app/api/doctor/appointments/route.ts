import { NextResponse } from "next/server";
import {prisma }from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor?.id },
      include: { patient: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
