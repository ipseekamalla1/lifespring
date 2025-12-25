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
      appointments: {
        select: {
          patientId: true,
        },
      },
    },
  });

  const formattedDoctors = doctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    department: doc.department,
    specialization: doc.specialization,
    experience: doc.experience,
    email: doc.user.email,
    phone: doc.phone,

    // ✅ correct patient count
    patientsCount: new Set(
      doc.appointments.map((a) => a.patientId)
    ).size,

    // ✅ status comes from DB
    status: doc.status,
  }));

  return NextResponse.json(formattedDoctors);
}

// ----------------------------------
// CREATE DOCTOR
// ----------------------------------
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, department, specialization, phone, experience } = body;

  // VALIDATION
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

  // DUPLICATE EMAIL CHECK
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

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

          // ✅ DEFAULT ACTIVE
          status: "ACTIVE",
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  return NextResponse.json({
    message: "Doctor created successfully",
    tempPassword,
    doctor: user.doctor,
  });
}

// ----------------------------------
// UPDATE DOCTOR
// ----------------------------------
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, name, department, specialization, phone, experience } = body;

  if (!id || !name || !department || !specialization || !phone) {
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
      { error: "Doctor ID is required" },
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


// ---------------------------------------------------
// TOGGLE DOCTOR STATUS
// ---------------------------------------------------
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
    data: {
      status,
    },
  });

  return NextResponse.json({
    message: "Status updated",
    doctor,
  });
}
