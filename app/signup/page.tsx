"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: any) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setSuccess("Signup successful! You can now login.");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Patient Signup</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
