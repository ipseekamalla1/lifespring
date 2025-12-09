import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.patient.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

  return NextResponse.json({
    message: "Login success",
    redirect: "/patient/dashboard",
  });
}
