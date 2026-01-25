import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fname, lname, email, password } = body;

    // ✅ Validation
    if (!fname || !lname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 1. CREATE USER (NO fname / lname here)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "PATIENT",
        emailVerified: false,
      },
    });

    // ✅ 2. CREATE PATIENT PROFILE (THIS is where names go)
    await prisma.patient.create({
      data: {
        userId: user.id,
        firstName: fname,
        lastName: lname,
      },
    });

    // ✅ 3. Create verification token (PATIENT only)
    const token = crypto.randomUUID();

    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });

    return NextResponse.json(
      {
        message: "Account created. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
