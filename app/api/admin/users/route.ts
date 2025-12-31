import { NextResponse } from "next/server";
import {prisma }from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      doctor: true,
      patient: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    hasDoctor: !!u.doctor,
    hasPatient: !!u.patient,
  }));

  return NextResponse.json(formatted);
}
