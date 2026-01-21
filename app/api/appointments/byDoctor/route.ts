import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!doctorId || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T23:59:59`);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: start, lte: end },
      status: { not: "CANCELLED" },
    },
    select: { date: true },
  });

  return NextResponse.json(appointments);
}