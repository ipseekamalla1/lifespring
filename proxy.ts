import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // Protected routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isPatientRoute = pathname.startsWith("/patient");

  if (isAdminRoute || isDoctorRoute || isPatientRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (isAdminRoute && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      if (isDoctorRoute && decoded.role !== "DOCTOR") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      if (isPatientRoute && decoded.role !== "PATIENT") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
