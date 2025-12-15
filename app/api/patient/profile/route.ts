import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

/* =======================
   GET PATIENT PROFILE
======================= */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
    };

    if (decoded.role !== "PATIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let patient = await prisma.patient.findUnique({
      where: { userId: decoded.id },
    });

    // ✅ Safety: ensure row always exists
    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId: decoded.id },
      });
    }

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/* =======================
   PATCH SINGLE FIELD
======================= */
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
    };

    if (decoded.role !== "PATIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { field, value } = await req.json();

    const allowedFields = [
      "name",
      "age",
      "gender",
      "phone",
      "address",
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json({ message: "Invalid field" }, { status: 400 });
    }

    const updatedPatient = await prisma.patient.update({
      where: { userId: decoded.id },
      data: {
        [field]: field === "age" && value ? Number(value) : value,
      },
    });

    return NextResponse.json(updatedPatient);
  } catch {
    return NextResponse.json(
      { message: "Failed to update field" },
      { status: 500 }
    );
  }
}
