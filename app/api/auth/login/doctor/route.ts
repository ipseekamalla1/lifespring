import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const doctor = await prisma.doctor.findUnique({ where: { email } });
  if (!doctor) return NextResponse.json({ error: "Invalid doctor email" }, { status: 400 });

  const match = await bcrypt.compare(password, doctor.password);
  if (!match) return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

  return NextResponse.json({
    message: "Doctor login success",
    redirect: "/doctor/dashboard",
  });
}
