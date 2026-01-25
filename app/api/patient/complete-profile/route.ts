import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    // 🔐 1. Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "PATIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🧾 2. Get data from body
    const body = await req.json();
    const {
      firstName,
      lastName,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      allergies,
      photoUrl,
    } = body;

    // ✅ 3. Validation
    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: "First name, last name and gender are required" },
        { status: 400 }
      );
    }

    // 🧠 4. Update patient
    const patient = await prisma.patient.update({
      where: { userId },
      data: {
        firstName,
        lastName,
        age: age ? Number(age) : null,
        gender,
        phone,
        address,
        bloodGroup,
        allergies: allergies ?? [],
        photoUrl,
        profileCompleted: true,
      },
    });

    return NextResponse.json({
      message: "Profile completed successfully",
      patient,
    });
  } catch (error) {
    console.error("COMPLETE PROFILE ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
