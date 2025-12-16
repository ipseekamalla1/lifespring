import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import{ prisma } from "./prisma";

export async function getPatientIdFromRequest() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

      console.log("TOKEN FROM API:", session);
    if (!session) return null;

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing");
      return null;
    }

    const decoded = jwt.verify(
      session,
      process.env.JWT_SECRET
    ) as { userId: string; role: string };

    if (!decoded.userId) return null;

    const patient = await prisma.patient.findUnique({
      where: { userId: decoded.userId },
    });

    return patient?.id || null;
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return null; // 🔥 NEVER throw
  }
}
