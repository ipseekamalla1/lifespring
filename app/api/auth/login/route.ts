import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: "Invalid email" }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ message: "Incorrect password" }, { status: 400 });

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
    secure: false, 
    path: "/",
    sameSite: "lax",
  });

  return res;
}
