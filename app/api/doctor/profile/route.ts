import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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
  select: {
    name: true,
    specialization: true,
    phone: true,
    experience: true,
    department: {
      select: {
        name: true,
      },
    },
    user: {
      select: {
        email: true,
      },
    },
  },
});


  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  return NextResponse.json({
  name: doctor.name,
  email: doctor.user.email,
  specialization: doctor.specialization,
  department: doctor.department?.name, // ✅ STRING
  phone: doctor.phone,
  experience: doctor.experience,
});
}


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
