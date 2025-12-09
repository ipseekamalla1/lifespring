import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ error: "Invalid admin email" }, { status: 400 });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

  return NextResponse.json({
    message: "Admin login success",
    redirect: "/admin/dashboard",
  });
}
