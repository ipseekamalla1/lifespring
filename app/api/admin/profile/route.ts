import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ================= AUTH HELPER ================= */
async function getAdminFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== "ADMIN") return null;
    return decoded;
  } catch {
    return null;
  }
}

/* ================= GET PROFILE ================= */
export async function GET() {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE EMAIL ================= */
export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: admin.id },
      },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: admin.id },
      data: { email },
      select: {
        id: true,
        email: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE email error:", error);
    return NextResponse.json(
      { error: "Failed to update email" },
      { status: 500 }
    );
  }
}

/* ================= CHANGE PASSWORD ================= */
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("CHANGE password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
