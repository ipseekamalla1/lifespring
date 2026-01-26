import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    /* ---------------- VALIDATION ---------------- */
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    /* ---------------- FETCH USER ---------------- */
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: true, // 🔥 REQUIRED
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    /* ---------------- PASSWORD CHECK ---------------- */
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    /* ---------------- EMAIL VERIFICATION ---------------- */
    if (user.role === "PATIENT" && !user.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    /* ---------------- PROFILE COMPLETION ---------------- */
    let profileCompleted = true;

    if (user.role === "PATIENT") {
      profileCompleted = user.patient?.profileCompleted ?? false;
    }

    /* ---------------- JWT ---------------- */
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        profileCompleted, // ✅ IMPORTANT
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    /* ---------------- RESPONSE ---------------- */
    const res = NextResponse.json({
      message: "Login success",
      role: user.role,
      profileCompleted, // ✅ FRONTEND NEEDS THIS
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
