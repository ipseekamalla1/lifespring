"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
  }

  return (
    <section className="w-full h-screen flex overflow-hidden">
      {/* LEFT – IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 relative"
      >
        <Image
          src="/images/doctors-hero.jpg"
          alt="Patient Signup"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* RIGHT – SIGNUP */}
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

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
              Patient Signup
            </h2>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* FIRST NAME */}
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="pl-11 h-12"
                  placeholder="First name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                />
              </div>

              {/* LAST NAME */}
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  className="pl-11 h-12"
                  placeholder="Last name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
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
                  required
                />
              </div>

              {/* PASSWORD */}
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
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f] text-white text-base font-medium"
              >
                Create Account
              </Button>
            </form>

            {/* LOGIN LINK */}
            <p className="mt-6 text-sm text-center text-slate-600">
              Already have an account?{" "}
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
