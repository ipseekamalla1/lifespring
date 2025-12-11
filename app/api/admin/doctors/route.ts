import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper: Email validator
function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

// Helper: Phone validator
function isValidPhone(phone: string) {
  return /^[0-9]{7,15}$/.test(phone);
}

// ---------------------------------------------------
// GET ALL DOCTORS
// ---------------------------------------------------
export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });

  return NextResponse.json(doctors);
}

// ---------------------------------------------------
// CREATE DOCTOR
// ---------------------------------------------------
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, department, specialization, phone, experience } = body;

  // --- VALIDATION ---
  if (!name || !email || !department || !specialization || !phone) {
    return NextResponse.json(
      { error: "All fields are required" },
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
      { error: "Phone number must be digits only (7–15 digits)" },
      { status: 400 }
    );
  }

  if (isNaN(Number(experience)) || Number(experience) < 0) {
    return NextResponse.json(
      { error: "Experience must be a positive number" },
      { status: 400 }
    );
  }

  // Check duplicate email
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 }
    );
  }

  // TEMP PASSWORD
  const tempPassword = "doctor123";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // CREATE USER + DOCTOR
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

// ---------------------------------------------------
// UPDATE DOCTOR
// ---------------------------------------------------
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, name, department, specialization, phone, experience } = body;

  // VALIDATIONS
  if (!name || !department || !specialization || !phone) {
    return NextResponse.json(
      { error: "All fields except email are required" },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Phone number must be digits only (7–15 digits)" },
      { status: 400 }
    );
  }

  if (isNaN(Number(experience)) || Number(experience) < 0) {
    return NextResponse.json(
      { error: "Experience must be a positive number" },
      { status: 400 }
    );
  }

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

// ---------------------------------------------------
// DELETE DOCTOR
// ---------------------------------------------------
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const doctor = await prisma.doctor.delete({ where: { id } });

  await prisma.user.delete({
    where: { id: doctor.userId },
  });

  return NextResponse.json({ message: "Doctor deleted" });
}
