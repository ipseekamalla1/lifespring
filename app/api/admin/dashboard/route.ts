import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // 🔐 Auth check (ADMIN only)
       const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 📊 Counts
    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
