"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
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
    <div className="resetPasswordPage flex flex-row">
      <div className="flex flex-col justify-center items-center h-screen w-1/2">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              type="password"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              type="password"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
              type="submit"
              disabled={!passwordsMatch}
            >
              Reset Password
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
      <div className="resetpageRight w-1/2"></div>
    </div>
  );
}

export default ResetPasswordPage;
