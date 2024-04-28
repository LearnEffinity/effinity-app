"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const sendResetLink = async (e: any) => {
    e.preventDefault();
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

    const supabase = createClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${clientUrl}/auth/reset`,
    });
    if (error) {
      console.log("Error:", error.message);
      return;
    }
    router.push("/auth/forgot-password/sent/");
    console.log("Email:", email);
  };

  return (
    <div className="forgotPasswordPage flex flex-row">
      <div className="flex flex-col justify-center items-center h-screen w-1/2">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">Forgot Your Password?</h1>
          <p className="text-gray-500 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
              onClick={sendResetLink}
            >
              Send Reset Link
            </button>
          </form>
          <a
            href="/auth/login/"
            className="text-blue-500 hover:text-blue-700 mt-4"
          >
            Back to Log In
          </a>
        </div>
      </div>
      <div className="forgotpageRight w-1/2"></div>
    </div>
  );
}
