import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ----------------------------------
// GET ALL DEPARTMENTS
// ----------------------------------
export async function GET() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(departments);
}

// ----------------------------------
// CREATE DEPARTMENT
// ----------------------------------
export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Department name is required" },
      { status: 400 }
    );
  }

  const exists = await prisma.department.findUnique({
    where: { name },
  });

  if (exists) {
    return NextResponse.json(
      { error: "Department already exists" },
      { status: 400 }
    );
  }

  const department = await prisma.department.create({
    data: { name },
  });

  return NextResponse.json({
    message: "Department created successfully",
    department,
  });
}

// ----------------------------------
// UPDATE DEPARTMENT
// ----------------------------------
export async function PUT(req: Request) {
  const { id, name } = await req.json();

  if (!id || !name) {
    return NextResponse.json(
      { error: "Department id and name are required" },
      { status: 400 }
    );
  }

  const department = await prisma.department.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json({
    message: "Department updated successfully",
    department,
  });
}

// ----------------------------------
// DELETE DEPARTMENT
// ----------------------------------
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Department id is required" },
      { status: 400 }
    );
  }

  const doctorsUsing = await prisma.doctor.findFirst({
    where: { departmentId: id },
  });

  if (doctorsUsing) {
    return NextResponse.json(
      { error: "Cannot delete department. Doctors are assigned to it." },
      { status: 400 }
    );
  }

  await prisma.department.delete({
    where: { id },
  });

  return NextResponse.json({
    message: "Department deleted successfully",
  });
}

