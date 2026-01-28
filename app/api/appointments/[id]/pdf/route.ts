import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Invalid appointment ID", { status: 400 });
  }

  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: {
        include: { user: true },
      },
      doctor: {
        include: {
          user: true,
          department: true,
        },
      },
    },
  });

  if (!appointment || appointment.patient.userId !== decoded.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* ---------- CREATE PDF ---------- */
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  const line = 16;
  let y = height - 40;

  const themeGreen = rgb(76 / 255, 166 / 255, 38 / 255);

  /* ---------- HEADER ---------- */
  page.drawRectangle({
    x: 0,
    y: height - 95,
    width,
    height: 95,
    color: themeGreen,
  });

  const logoPath = path.join(process.cwd(), "public/images/logo2.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdf.embedPng(logoBytes);

  page.drawImage(logoImage, {
    x: margin,
    y: height - 80,
    width: 60,
    height: 60,
  });

  page.drawText("LifeSpring", {
    x: margin + 80,
    y: height - 45,
    size: 20,
    font: bold,
    color: rgb(1, 1, 1),
  });

  page.drawText("Appointment Confirmation", {
    x: margin + 80,
    y: height - 65,
    size: 11,
    font,
    color: rgb(1, 1, 1),
  });

  y = height - 120;

  /* ---------- CARD HELPER ---------- */
  const drawCard = (title: string, content: () => void) => {
    page.drawText(title, {
      x: margin,
      y,
      font: bold,
      size: 15,
    });

    y -= 10;

    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 18;
    content();
    y -= 40; // 🔹 vertical gap between sections
  };

  /* ---------- STATUS COLORS ---------- */
  const statusColor =
    appointment.status === "CONFIRMED"
      ? rgb(0.1, 0.4, 0.8)
      : appointment.status === "CANCELLED"
      ? rgb(0.8, 0.2, 0.2)
      : rgb(0.9, 0.7, 0.1);

  /* ---------- PATIENT INFO ---------- */
  drawCard("Patient Information", () => {
    page.drawText(
      `Name: ${appointment.patient.firstName ?? ""} ${appointment.patient.lastName ?? ""}`,
      { x: margin, y, font, size: 12 }
    );

    page.drawText(
      `${appointment.status}`,
      {
        x: width - margin - 160,
        y,
        font: bold,
        size: 11,
        color: statusColor,
      }
    );

    y -= line;

    page.drawText(
      `Email: ${appointment.patient.user.email}`,
      { x: margin, y, font, size: 12 }
    );
    y -= line;

    page.drawText(
      `Blood Group: ${appointment.patient.bloodGroup ?? "N/A"}`,
      { x: margin, y, font, size: 12 }
    );
    y -= line;

    page.drawText(
      `Phone: ${appointment.patient.phone ?? "N/A"}`,
      { x: margin, y, font, size: 12 }
    );
  });

  /* ---------- APPOINTMENT DETAILS ---------- */
  drawCard("Appointment Details", () => {
    page.drawText(
      `Date: ${appointment.date.toDateString()}`,
      { x: margin, y, font, size: 12 }
    );

    page.drawText(
      `Time: ${appointment.date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      { x: margin + 260, y, font, size: 12 }
    );

    y -= line + 6;

    page.drawText("Reason:", {
      x: margin,
      y,
      font: bold,
      size: 12,
    });

    y -= line;

    page.drawText(appointment.reason || "N/A", {
      x: margin,
      y,
      font,
      size: 11,
      maxWidth: width - margin * 2,
      lineHeight: 14,
    });
  });

  /* ---------- DOCTOR INFO ---------- */
  drawCard("Doctor Information", () => {
    page.drawText(
      `Name: ${appointment.doctor.name ?? "N/A"}`,
      { x: margin, y, font, size: 12 }
    );
    y -= line;

    page.drawText(
      `Email: ${appointment.doctor.user.email}`,
      { x: margin, y, font, size: 12 }
    );
    y -= line;

    page.drawText(
      `Specialization: ${appointment.doctor.specialization ?? "N/A"}`,
      { x: margin, y, font, size: 12 }
    );
    y -= line;

    page.drawText(
      `Department: ${appointment.doctor.department?.name ?? "N/A"}`,
      { x: margin, y, font, size: 12 }
    );
  });

  /* ---------- FOOTER ---------- */
  page.drawLine({
    start: { x: margin, y: 70 },
    end: { x: width - margin, y: 70 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  page.drawText(
    "Please arrive 10 minutes early. This document is system generated.",
    {
      x: margin,
      y: 50,
      size: 9,
      font,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  const bytes = await pdf.save();

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=appointment.pdf",
    },
  });
}
