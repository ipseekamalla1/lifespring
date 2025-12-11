import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Validate helpers
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
function isValidPhone(phone) {
  return /^[0-9]{7,15}$/.test(phone);
}

// -----------------------------------------------------
// GET ALL PATIENTS
// -----------------------------------------------------
export async function GET() {
  const patients = await prisma.patient.findMany({
    include: { user: true },
  });

  return NextResponse.json(patients);
}

// -----------------------------------------------------
// CREATE PATIENT
// -----------------------------------------------------
export async function POST(req) {
  const body = await req.json();
  const { name, email, age, gender, address, phone } = body;

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, Email and Phone are required" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Phone must be 7–15 digits" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
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
          name,
          age: age ? Number(age) : null,
          gender,
          address,
          phone,
        },
      },
    },
  });

  return NextResponse.json({
    message: "Patient created successfully",
    tempPassword,
    user,
  });
}

// -----------------------------------------------------
// UPDATE PATIENT
// -----------------------------------------------------
export async function PUT(req) {
  const body = await req.json();
  const { id, name, age, gender, address, phone } = body;

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Phone must be 7–15 digits" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      name,
      age: age ? Number(age) : null,
      gender,
      address,
      phone,
    },
  });

  return NextResponse.json({ message: "Patient updated", patient });
}

// -----------------------------------------------------
// DELETE PATIENT
// -----------------------------------------------------
export async function DELETE(req) {
  const { id } = await req.json();

  const patient = await prisma.patient.delete({ where: { id } });

  await prisma.user.delete({
    where: { id: patient.userId },
  });

  return NextResponse.json({ message: "Patient deleted" });
}
