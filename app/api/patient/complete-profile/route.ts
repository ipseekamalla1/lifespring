import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    /* -------------------- AUTH -------------------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; };
    if (decoded.role !== "PATIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const userId = decoded.id;

    /* -------------------- BODY -------------------- */
    const { dateOfBirth, gender, phone, address, bloodGroup, allergies, photoUrl } = await req.json();

    /* -------------------- VALIDATION -------------------- */
    if (!gender) return NextResponse.json({ error: "Gender is required" }, { status: 400 });
    if (dateOfBirth && new Date(dateOfBirth) > new Date()) return NextResponse.json({ error: "DOB cannot be in the future" }, { status: 400 });

    /* -------------------- UPDATE -------------------- */
    const patient = await prisma.patient.update({
      where: { userId },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        phone,
        address,
        bloodGroup, // must match enum values: A_POS, B_NEG, etc.
        allergies: allergies ?? [],
        photoUrl,
        profileCompleted: true,
      },
    });

    return NextResponse.json({ message: "Profile completed successfully", patient });
  } catch (error) {
    console.error("COMPLETE PROFILE ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
