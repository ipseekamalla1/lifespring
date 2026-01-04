import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/* =========================
   GET NOTES
========================= */
export async function GET(
  req: Request,
  { params }: { params: { id: string } } // App Router params
) {
  try {
    const { id } = await params;

    // ✅ Server-side cookies
    const cookieStore = await  cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = session.value;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    // Only doctors can access
    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

    // Fetch notes for this appointment
    const notes = await prisma.appointmentNote.findMany({
      where: {
        appointmentId: id,
        doctorId: doctor.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET notes error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* =========================
   ADD NOTE
========================= */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } =  await params;

    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = session.value;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "DOCTOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Not a doctor" }, { status: 403 });
    }

     const { note } = await req.json();

    const newNote = await prisma.appointmentNote.create({
      data: {
        appointmentId: id,
        doctorId: doctor.id,
        note,
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error("POST note error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
