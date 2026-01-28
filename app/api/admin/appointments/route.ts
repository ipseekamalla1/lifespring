import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
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

    /* ---------- FETCH APPOINTMENTS ---------- */
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: "desc" },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        doctor: {
          select: {
            name: true,
            department: {
              select: { name: true },
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
