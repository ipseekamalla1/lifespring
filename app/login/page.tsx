"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
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

    if (data.role === "ADMIN") window.location.href = "/admin/dashboard";
    if (data.role === "DOCTOR") window.location.href = "/doctor/dashboard";
    if (data.role === "PATIENT") window.location.href = "/patient/dashboard";
  }

  return (
    <section className="w-full h-screen flex overflow-hidden">
      {/* LEFT – FULL IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 relative"
      >
        <Image
          src="/images/doctor-potrait.jpg"
          alt="Healthcare Login"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* RIGHT – LOGIN */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center bg-[#f6faf3] px-6"
      >
        <Card className="w-full max-w-md shadow-xl rounded-2xl">
          <CardContent className="p-10">
            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <Link href="/">
                <div className="w-25 h-25 rounded-full bg-[#4ca626] shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                  <Image
                    src="/images/logo2.png"
                    alt="LifeSpring Logo"
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="pl-11 h-12"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  type="password"
                  className="pl-11 h-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="accent-[#4ca626]" />
                  Keep me signed in
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[#4ca626] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f] text-white text-base font-medium"
              >
                Sign In
              </Button>
            </form>

            {/* REGISTER */}
            <p className="mt-6 text-sm text-center text-slate-600">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#4ca626] font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
