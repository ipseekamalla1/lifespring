import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* ---------------- HELPERS ---------------- */

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (phone: string) => /^[0-9]{7,15}$/.test(phone);

/* ---------------- GET ALL ---------------- */

export async function GET() {
  const patients = await prisma.patient.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(patients);
}

/* ---------------- CREATE ---------------- */

export async function POST(req: Request) {
  const { name, email, age, gender, address, phone } = await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, Email, Phone required" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email) || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Invalid email or phone" },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const tempPassword = "patient123";
  const hashed = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
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
    include: { patient: true },
  });

  return NextResponse.json({ message: "Patient created", user });
}

/* ---------------- UPDATE ---------------- */

export async function PUT(req: Request) {
  const { id, name, age, gender, address, phone } = await req.json();

  if (!id || !name || !phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
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

  return NextResponse.json({ message: "Updated", patient });
}

/* ---------------- DELETE ---------------- */

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const patient = await prisma.patient.delete({ where: { id } });
  await prisma.user.delete({ where: { id: patient.userId } });

  return NextResponse.json({ message: "Deleted" });
}
