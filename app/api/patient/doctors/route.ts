// app/api/patient/doctors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        department: {select:{name:true}},
        experience: true,
        phone: true,
      },
    });

    return NextResponse.json(
      doctors.map((d) => ({
        ...d,
        department: d.department?.name || null, 
      }))
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
