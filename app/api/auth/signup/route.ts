import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user as PATIENT
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "PATIENT",
        patient: {
          create: {
            name,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Signup successful", user },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
