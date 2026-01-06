import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ MUST await params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Doctor ID missing" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        specialization: true,
        experience: true,
        phone: true,
        department: {
          select: { name: true },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...doctor,
      department: doctor.department?.name ?? null,
    });
  } catch (error) {
    console.error("Doctor fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}
