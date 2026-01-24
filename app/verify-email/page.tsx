"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MailCheck, Loader2, ShieldCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(!!token);
  const [error, setError] = useState("");

  /* 🔐 VERIFY TOKEN FROM EMAIL */
  useEffect(() => {
    if (!token) return;

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError("This verification link is invalid or expired.");
          setVerifying(false);
          return;
        }

        router.replace("/verify-success");
      } catch {
        setError("Something went wrong. Please try again.");
        setVerifying(false);
      }
    }

    verifyEmail();
  }, [token, router]);

  /* 🔁 RESEND EMAIL */
  async function resendVerification() {
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
    } else {
      setMessage("Verification email sent again. Please check your inbox.");
    }

    setLoading(false);
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f6faf3] to-[#eaf5e3] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-[#4ca626] p-8 text-center">
            <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Image
                src="/images/logo2.png"
                alt="LifeSpring"
                width={60}
                height={60}
              />
            </div>
            <h1 className="text-white text-2xl font-semibold mt-4">
              LifeSpring Health
            </h1>
          </div>

          {/* CONTENT */}
          <CardContent className="p-10 text-center space-y-6">
            {verifying ? (
              <>
                <Loader2
                  size={48}
                  className="mx-auto animate-spin text-[#4ca626]"
                />
                <h2 className="text-2xl font-semibold text-slate-800">
                  Verifying your email…
                </h2>
                <p className="text-slate-600">
                  Please wait while we secure your account.
                </p>
              </>
            ) : error ? (
              <>
                <ShieldCheck size={48} className="mx-auto text-red-500" />
                <h2 className="text-2xl font-semibold text-red-600">
                  Verification failed
                </h2>
                <p className="text-slate-600">{error}</p>
              </>
            ) : (
              <>
                <MailCheck size={52} className="mx-auto text-[#4ca626]" />
                <h2 className="text-2xl font-semibold text-slate-800">
                  Check your inbox
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We’ve sent a verification link to
                  <br />
                  <span className="font-medium text-slate-800">{email}</span>
                </p>

                <Button
                  onClick={resendVerification}
                  disabled={loading}
                  className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f] text-white text-base rounded-xl"
                >
                  {loading ? "Sending..." : "Resend verification email"}
                </Button>

                {message && (
                  <p className="text-sm text-green-600">{message}</p>
                )}

                <p className="text-sm text-slate-600">
                  Already verified?{" "}
                  <Link
                    href="/login"
                    className="text-[#4ca626] font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
