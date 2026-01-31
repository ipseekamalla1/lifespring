"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    setSuccess("If an account exists, a reset link has been sent to your email.");
    setEmail("");
  }

  return (
    <section className="w-full h-screen flex items-center justify-center bg-[#f6faf3] px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-10 space-y-6">
            {/* LOGO */}
            <div className="flex justify-center">
              <Image
                src="/images/logo2.png"
                alt="LifeSpring Logo"
                width={72}
                height={72}
              />
            </div>

            <h1 className="text-2xl font-semibold text-center">
              Forgot your password?
            </h1>

            <p className="text-sm text-center text-slate-600">
              Enter your email and we’ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  required
                  className="pl-11 h-12"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-600 text-center">
                  {success}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f]"
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <p className="text-sm text-center text-slate-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-[#4ca626] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
