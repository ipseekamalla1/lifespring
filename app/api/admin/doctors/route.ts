import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ----------------------------------
// HELPERS
// ----------------------------------
function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function isValidPhone(phone: string) {
  return /^[0-9]{7,15}$/.test(phone);
}

// ----------------------------------
// GET ALL DOCTORS
// ----------------------------------
export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      department: true,
      appointments: {
        select: { patientId: true },
      },
    },
  });

  const formattedDoctors = doctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    department: doc.department?.name ?? "—",
    departmentId: doc.departmentId,
    specialization: doc.specialization,
    experience: doc.experience,
    email: doc.user.email,
    phone: doc.phone,
    patientsCount: new Set(
      doc.appointments.map((a) => a.patientId)
    ).size,
    status: doc.status,
  }));

  return NextResponse.json(formattedDoctors);
}

// ----------------------------------
// CREATE DOCTOR
// ----------------------------------
export async function POST(req: Request) {
  const body = await req.json();
  const {
    name,
    email,
    departmentId,
    specialization,
    phone,
    experience,
  } = body;

  if (!name || !email || !departmentId || !specialization || !phone) {
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

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash("doctor123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          name,
          specialization,
          phone,
          experience: Number(experience),
          status: "ACTIVE",
          department: {
            connect: { id: departmentId },
          },
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  return NextResponse.json({
    message: "Doctor created successfully",
    tempPassword: "doctor123",
    doctor: user.doctor,
  });
}

// ----------------------------------
// UPDATE DOCTOR (✅ FIXED)
// ----------------------------------
export async function PUT(req: Request) {
  const body = await req.json();
  const {
    id,
    name,
    departmentId,
    specialization,
    phone,
    experience,
  } = body;

  if (!id || !name || !departmentId || !specialization || !phone) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
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
      specialization,
      phone,
      experience: Number(experience),
      department: {
        connect: { id: departmentId },
      },
    },
  });

  return NextResponse.json({
    message: "Doctor updated successfully",
    doctor,
  });
}

// ----------------------------------
// DELETE DOCTOR
// ----------------------------------
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Doctor ID required" },
      { status: 400 }
    );
  }

  const doctor = await prisma.doctor.delete({
    where: { id },
  });

  await prisma.user.delete({
    where: { id: doctor.userId },
  });

  return NextResponse.json({
    message: "Doctor deleted successfully",
  });
}

// ----------------------------------
// TOGGLE STATUS
// ----------------------------------
export async function PATCH(req: Request) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Doctor id and status required" },
      { status: 400 }
    );
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({
    message: "Status updated",
    doctor,
  });
}
