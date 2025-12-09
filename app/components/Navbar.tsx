"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 shadow">
      <Link href="/" className="text-xl font-bold">Medical System</Link>

      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>

        <Link href="/signup">
          <Button>Signup</Button>
        </Link>
      </div>
    </nav>
  );
}
