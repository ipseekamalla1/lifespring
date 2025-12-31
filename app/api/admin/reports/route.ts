import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    // 🔐 Auth (ADMIN only)
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    /* ================= KPI COUNTS ================= */

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({ where: { status: "CANCELLED" } }),
    ]);

    /* ================= MONTHLY APPOINTMENT TREND ================= */
    const monthlyAppointments = await prisma.appointment.groupBy({
      by: ["createdAt"],
      _count: true,
    });

    // Convert to month-wise counts
    const trendMap: Record<string, number> = {};
    monthlyAppointments.forEach((item) => {
      const month = item.createdAt.toLocaleString("default", {
        month: "short",
      });
      trendMap[month] = (trendMap[month] || 0) + item._count;
    });

    const appointmentTrend = Object.entries(trendMap).map(
      ([month, appointments]) => ({
        month,
        appointments,
      })
    );

    return NextResponse.json({
      kpis: {
        totalDoctors,
        totalPatients,
        totalAppointments,
      },
      appointmentStatus: [
        { name: "Pending", value: pendingAppointments },
        { name: "Confirmed", value: confirmedAppointments },
        { name: "Cancelled", value: cancelledAppointments },
      ],
      usersOverview: [
        { name: "Doctors", count: totalDoctors },
        { name: "Patients", count: totalPatients },
      ],
      appointmentTrend,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
