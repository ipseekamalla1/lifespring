"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifySuccessPage() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-[#f6faf3] px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="rounded-2xl shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            {/* LOGO */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-[#4ca626] shadow-md flex items-center justify-center">
                <Image
                  src="/images/logo2.png"
                  alt="LifeSpring"
                  width={60}
                  height={60}
                />
              </div>
            </div>

            {/* ICON */}
            <CheckCircle size={56} className="mx-auto text-[#4ca626]" />

            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-slate-800">
              Email Verified 🎉
            </h1>

            {/* TEXT */}
            <p className="text-slate-600 leading-relaxed">
              Your email has been successfully verified.
              <br />
              You can now sign in to your LifeSpring account.
            </p>

            {/* BUTTON */}
            <Link href="/login">
              <Button className="w-full h-12 bg-[#4ca626] hover:bg-[#3f8f1f] text-white text-base">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
