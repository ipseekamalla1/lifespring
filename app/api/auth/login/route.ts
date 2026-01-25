import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

     const user = await prisma.user.findUnique({
    where: { email },
    include: { patient: true },
  });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 🚫 BLOCK LOGIN IF EMAIL NOT VERIFIED
    if (user.role== 'PATIENT' && !user.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    let profileCompleted = true;

  if (user.role === "PATIENT") {
    profileCompleted =
      !!user.patient?.firstName &&
      !!user.patient?.lastName;
  }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({
      message: "Login success",
      role: user.role,
    });

    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
