import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* =========================
   GET Doctor Profile
========================= */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: decoded.id },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: doctor.id,
    name: doctor.name,
    department: doctor.department,
    specialization: doctor.specialization,
    phone: doctor.phone,
    experience: doctor.experience,
    email: doctor.user.email,
  });
}

/* =========================
   UPDATE Doctor Profile
========================= */
export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (decoded.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updatedDoctor = await prisma.doctor.update({
    where: { userId: decoded.id },
    data: {
      name: body.name,
      department: body.department,
      specialization: body.specialization,
      phone: body.phone,
      experience: body.experience,
    },
  });

  return NextResponse.json({ success: true, doctor: updatedDoctor });
}
