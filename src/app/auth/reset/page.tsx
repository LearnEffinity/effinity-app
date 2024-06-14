"use client";
import React, { useState, useEffect, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

import { InputWithLabel } from "@/components/form/Input";
import Button from "@/components/form/Button";

function ResetPasswordPage() {
  const supabase = createClient();
  const [validSession, setValidSession] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const passwordsMatch = newPassword === confirmPassword;
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  if (!code) {
    return <p>Invalid reset code.</p>;
  }
  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Error validating reset code:", error.message);
        return;
      }
      setValidSession(true);
      const session = await supabase.auth.getSession()
      console.log("Session:", session);

    }
    checkSession();
  }
  , [code]);
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setError(error.message);
      return;
    }
    setError("");
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">Reset Your Password</h1>
      </hgroup>
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <InputWithLabel
          label="New Password"
          value={newPassword}
          onChange={(v) => setNewPassword(v)}
          type="password"
        />
        <InputWithLabel
          label="Confirm Password"
          value={confirmPassword}
          onChange={(v) => setConfirmPassword(v)}
          type="password"
        />
        <Button className="mt-4" type="submit">
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;
