import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all doctors
export async function GET() {
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });

  return NextResponse.json(doctors);
}

// CREATE a new doctor
export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // check if email exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create User first
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "DOCTOR",
      },
    });

    // create Doctor profile
    await prisma.doctor.create({
      data: {
        userId: newUser.id,
        name,
      },
    });

    return NextResponse.json({ message: "Doctor created successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}

// UPDATE doctor
export async function PUT(req: Request) {
  try {
    const { id, name, email } = await req.json();

    // update doctor + user
    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        user: {
          update: { email },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}

// DELETE doctor
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // delete doctor → then user
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: doctor.userId },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 }
    );
  }
}
