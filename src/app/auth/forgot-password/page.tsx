"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { InputWithLabel } from "@/components/form/Input";
import Button from "@/components/form/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendResetLink = async () => {
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
    <div className="flex h-full flex-col gap-8 py-8">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">Forgot your password?</h1>
        <p className="text-lg text-text-secondary">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </hgroup>
      <form className="flex flex-col gap-4">
        <InputWithLabel
          label="Email"
          value={email}
          onChange={(v) => setEmail(v)}
          type="email"
        />
        <Button onClick={sendResetLink}>Reset Password</Button>
      </form>
    </div>
  );
}
