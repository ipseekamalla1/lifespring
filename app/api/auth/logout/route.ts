import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Remove the session cookie
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // expires immediately
  });

  return response;
}
