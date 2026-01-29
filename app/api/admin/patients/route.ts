import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* ---------------- HELPERS ---------------- */

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (phone: string) => /^[0-9]{7,15}$/.test(phone);

/* ---------------- GET ALL PATIENTS ---------------- */

export async function GET() {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(patients);
}

/* ---------------- CREATE PATIENT ---------------- */

export async function POST(req: Request) {
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    gender,
    address,
    phone,
  } = await req.json();

  if (!firstName || !email || !phone) {
    return NextResponse.json(
      { error: "First name, email, and phone are required" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email) || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid email or phone" },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const tempPassword = "patient123";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "PATIENT",
      patient: {
        create: {
          firstName,
          lastName: lastName || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          address,
          phone,
        },
      },
    },
    include: {
      patient: true,
    },
  });

  return NextResponse.json({
    message: "Patient created successfully",
    user,
  });
}

/* ---------------- UPDATE PATIENT ---------------- */

export async function PUT(req: Request) {
  const {
    id,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    phone,
  } = await req.json();

  if (!id || !firstName || !phone) {
    return NextResponse.json(
      { error: "Patient id, first name, and phone are required" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      firstName,
      lastName: lastName || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      address,
      phone,
    },
  });

  return NextResponse.json({
    message: "Patient updated successfully",
    patient,
  });
}

/* ---------------- DELETE PATIENT ---------------- */

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Patient id is required" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.delete({
    where: { id },
  });

  await prisma.user.delete({
    where: { id: patient.userId },
  });

  return NextResponse.json({
    message: "Patient deleted successfully",
  });
}
