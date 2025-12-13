import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  if (decoded.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const doctor = await prisma.doctor.update({
    where: { userId: decoded.id },
    data: {
      name: body.name,
      department: body.department,
      specialization: body.specialization,
      phone: body.phone,
      experience: body.experience,
    },
  });

  return NextResponse.json(doctor);
}
