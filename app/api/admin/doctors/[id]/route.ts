import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ UNWRAP PARAMS (REQUIRED IN NEXT 15)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Doctor ID missing" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
        appointments: {
          include: { patient: true },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Doctor fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
