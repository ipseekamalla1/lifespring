import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existing = await prisma.patient.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.patient.create({
    data: { name, email, password: hashed },
  });

  return NextResponse.json({ message: "Patient registered successfully" });
}
