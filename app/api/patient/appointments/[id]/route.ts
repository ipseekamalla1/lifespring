import { NextResponse } from "next/server";
import { prisma }from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
