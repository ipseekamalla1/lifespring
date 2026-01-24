import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 400 }
      );
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Token not found" },
        { status: 404 }
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Token expired" },
        { status: 410 }
      );
    }

    // ✅ Verify user
    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    });

    // 🧹 Delete token
    await prisma.verificationToken.delete({
      where: { id: record.id },
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
