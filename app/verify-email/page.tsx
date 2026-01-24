"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function resendVerification() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Something went wrong");
    } else {
      setMessage("Verification email sent again. Please check your inbox.");
    }

    setLoading(false);
  }

  return (
    <section className="w-full h-screen flex items-center justify-center bg-[#f6faf3] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl rounded-2xl">
          <CardContent className="p-12 text-center space-y-6">
            {/* LOGO */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-[#4ca626] shadow-md flex items-center justify-center">
                <Image
                  src="/images/logo2.png"
                  alt="LifeSpring Logo"
                  width={60}
                  height={60}
                />
              </div>
            </div>

            {/* ICON */}
            <MailCheck size={48} className="mx-auto text-[#4ca626]" />

            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-slate-800">
              Verify your email
            </h1>

            {/* TEXT */}
            <p className="text-slate-600 leading-relaxed">
              We’ve sent a verification link to <br />
              <span className="font-medium text-slate-800">{email}</span>
            </p>

            <p className="text-sm text-slate-500">
              Please check your inbox and click the link to activate your
              account.
            </p>

            {/* RESEND */}
            <Button
              onClick={resendVerification}
              disabled={loading}
              className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f] text-white text-base"
            >
              {loading ? "Sending..." : "Resend verification email"}
            </Button>

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            {/* LOGIN */}
            <p className="text-sm text-slate-600">
              Already verified?{" "}
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
