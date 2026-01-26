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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
    };

    if (decoded.role !== "PATIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let patient = await prisma.patient.findUnique({
      where: { userId: decoded.id },
    });

    // ✅ Ensure patient row always exists
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          userId: decoded.id,
          firstName: "",
          lastName: "",
        },
      });
    }

    // ✅ Return clean payload for frontend
    return NextResponse.json({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      phone: patient.phone,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      photoUrl: patient.photoUrl,
      profileCompleted: patient.profileCompleted,
    });
  } catch (error) {
    console.error("GET PATIENT PROFILE ERROR:", error);
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
    const cookieStore = cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
    };

    if (decoded.role !== "PATIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { field, value } = await req.json();

    // ✅ Fields allowed by your schema
    const allowedFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "address",
      "phone",
      "bloodGroup",
      "allergies",
      "photoUrl",
      "profileCompleted",
    ];

    if (!allowedFields.includes(field)) {
      return NextResponse.json({ message: "Invalid field" }, { status: 400 });
    }

    const updatedPatient = await prisma.patient.update({
      where: { userId: decoded.id },
      data: {
        [field]:
          field === "dateOfBirth" && value
            ? new Date(value)
            : value,
      },
    });

    return NextResponse.json({
      firstName: updatedPatient.firstName,
      lastName: updatedPatient.lastName,
      dateOfBirth: updatedPatient.dateOfBirth,
      gender: updatedPatient.gender,
      address: updatedPatient.address,
      phone: updatedPatient.phone,
      bloodGroup: updatedPatient.bloodGroup,
      allergies: updatedPatient.allergies,
      photoUrl: updatedPatient.photoUrl,
      profileCompleted: updatedPatient.profileCompleted,
    });
  } catch (error) {
    console.error("PATCH PATIENT PROFILE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update field" },
      { status: 500 }
    );
  }
}
