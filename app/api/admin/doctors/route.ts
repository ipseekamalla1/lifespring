import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 🔹 GET ALL DOCTORS
export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
    },
  });

  return NextResponse.json(doctors);
}

// 🔹 CREATE DOCTOR (Admin Only)
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, department, specialization, phone, experience } = body;

  // Generate temporary password
  const tempPassword = "doctor123";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Create a user with DOCTOR role
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          name,
          department,
          specialization,
          phone,
          experience: Number(experience),
        },
      },
    },
  });

  return NextResponse.json({
    message: "Doctor created successfully",
    tempPassword,
    user,
  });
}

// 🔹 UPDATE DOCTOR
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, name, department, specialization, phone, experience } = body;

  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      name,
      department,
      specialization,
      phone,
      experience: Number(experience),
    },
  });

  return NextResponse.json({ message: "Doctor updated", doctor });
}

// 🔹 DELETE DOCTOR
export async function DELETE(req: Request) {
  const { id } = await req.json();

  // Delete doctor profile
  const doctor = await prisma.doctor.delete({
    where: { id },
  });

  // Also delete user
  await prisma.user.delete({
    where: { id: doctor.userId },
  });

  return NextResponse.json({ message: "Doctor deleted" });
}
