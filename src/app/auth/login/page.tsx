"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { InputWithLabel } from "@/components/form/Input";
import Button, { SocialMediaButton } from "@/components/form/Button";
import Checkbox from "@/components/form/Checkbox";

import type { SupabaseClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const supabase = createClient();
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">Log In</h1>
        <p className="text-lg text-text-secondary">
          Take control of your financial journey.
        </p>
      </hgroup>
      <LoginForm signInWithGoogle={signInWithGoogle} supabase={supabase} />
      <span className="text-sm">
        Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
      </span>
    </div>
  );
}

function LoginForm({
  supabase,
  signInWithGoogle,
}: {
  supabase: SupabaseClient<any, "public", any>;
  signInWithGoogle: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleLoginButton = async (e: any) => {
    e.preventDefault();
    console.log("Email:", email);


    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Failed to login:", error.message);
      setError("Failed to login: " + error.message);
      setIsInvalid(true);
    } else {
      setError("");
    }
    console.log("Logged in:", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleLoginButton}>
      <div className="flex flex-col gap-6 py-4">
        <SocialMediaButton onClick={signInWithGoogle} />
        <div className="flex items-center gap-5">
          <span className="flex-grow border-b border-text-tertiary"></span>
          <span className="text-text-secondary">or Sign in with Email</span>
          <span className="flex-grow border-b border-text-tertiary"></span>
        </div>
      </div>
      {isInvalid && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, type: "spring" }} className="w-full bg-error-100 text-text-error text-center py-4 rounded-lg">Invalid username or password</motion.div>
      )}
      <InputWithLabel
        label="Email"
        type="email"
        value={email}
        onChange={(v) => setEmail(v)}
      />
      <InputWithLabel
        label="Password"
        type="password"
        value={password}
        onChange={(v) => setPassword(v)}
      />
      <div className="text-sm flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Checkbox
            onChange={(v: boolean) => console.log(`Remember me set to ${v}`)}
          />
          <span>Remember me</span>
        </span>
        <a href="/auth/forgot-password" className="text-text-primary">
          Forgot password?
        </a>
      </div>
      <Button type="submit" className="mt-4">
        Log In
      </Button>
    </form>
  );
}
