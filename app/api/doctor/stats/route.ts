import { NextResponse } from "next/server";
import{ prisma} from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [totalAppointments, todayAppointments, pendingAppointments] =
      await Promise.all([
        prisma.appointment.count({ where: { doctorId: doctor.id } }),
        prisma.appointment.count({
          where: {
            doctorId: doctor.id,
            date: { gte: start, lte: end },
          },
        }),
        prisma.appointment.count({
          where: {
            doctorId: doctor.id,
            status: "PENDING",
          },
        }),
      ]);

    return NextResponse.json({
      totalAppointments,
      todayAppointments,
      pendingAppointments,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load stats" },
      { status: 500 }
    );
  }
}
