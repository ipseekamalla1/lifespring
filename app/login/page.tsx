"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    // redirect based on role returned by backend
    if (data.role === "ADMIN") window.location.href = "/admin/dashboard";
    if (data.role === "DOCTOR") window.location.href = "/doctor/dashboard";
    if (data.role === "PATIENT") window.location.href = "/patient/dashboard";
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
