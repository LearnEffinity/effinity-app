"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { InputWithLabel } from "@/components/form/Input";
import Button, { SocialMediaButton } from "@/components/form/Button";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const supabase = createClient();
  const [emailValidated, setEmailValidated] = useState(false);
  const [email, setEmail] = useState("");

  async function signUpWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Error signing up with Google:", error);
    else {
      console.log("Signed in with Google:", data);
    }
  }

  const validateEmail = async (email: string) => {
    console.log("Validating email:", email);
    if (!emailRegex.test(email)) {
      setEmailValidated(false);
      return "Invalid email address.";
    }

    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("email", email);

    console.log("Email validation response:", data, error);
    if (data && data.length > 0) {
      setEmailValidated(false);
      return "Email already exists. Please use a different email.";
    }

    setEmailValidated(true);
    return "";
  };

  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">Sign Up</h1>
        <p className="text-lg text-text-secondary">
          Take control of your financial journey.
        </p>
      </hgroup>
      <SignupForm
        email={email}
        setEmail={setEmail}
        emailValidated={emailValidated}
        validateEmail={validateEmail}
        supabase={supabase}
        signUpWithGoogle={signUpWithGoogle}
      />
      <span className="text-sm">
        Already have an account? <a href="/auth/login">Log in</a>
      </span>
    </div>
  );
}

function SignupForm({
  email,
  setEmail,
  emailValidated,
  validateEmail,
  supabase,
  signUpWithGoogle,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailValidated: boolean;
  validateEmail: (email: string) => Promise<string>;
  supabase: any;
  signUpWithGoogle: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [error, setError] = useState("");
  const [emailCheckPerformed, setEmailCheckPerformed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSignupButton = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate email if not already validated
    if (!emailValidated) {
      const emailValidationError = await validateEmail(email);
      setEmailError(emailValidationError);
      setEmailCheckPerformed(true);
      if (emailValidationError) hasError = true;
    }

    // Validate username
    const { data: usernameData, error: usernameError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username);
    if (usernameData && usernameData.length > 0) {
      setUsernameError("Username already exists. Please choose another one.");
      hasError = true;
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include a number and a letter, and contain no spaces.",
      );
      hasError = true;
    }

    if (hasError) {
      setIsInvalid(true);
      return;
    }

    // Sign up
    const { error: signupError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: username,
        },
      },
    });

    if (signupError) {
      console.error("Error signing up:", signupError);
      setError("Failed to sign up: " + signupError.message);
      setIsInvalid(true);
    } else {
      setError("");
      setIsInvalid(false);
      window.location.href = "/";
    }
  };

  const handleEmailValidation = async () => {
    const error = await validateEmail(email);
    setEmailError(error);
    setEmailCheckPerformed(true);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSignupButton}>
      <div className="flex flex-col gap-6 py-4">
        <SocialMediaButton onClick={signUpWithGoogle} />
        <div className="flex items-center gap-5">
          <span className="flex-grow border-b border-text-tertiary"></span>
          <span className="text-text-secondary">or Sign Up with Email</span>
          <span className="flex-grow border-b border-text-tertiary"></span>
        </div>
      </div>
      {isInvalid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full rounded-lg bg-error-100 py-4 text-center text-text-error"
        >
          {error || "Please correct the errors below."}
        </motion.div>
      )}
      <InputWithLabel
        label="Email"
        type="email"
        value={email}
        onChange={(v) => {
          setEmail(v);
          setEmailCheckPerformed(false);
          setEmailError("");
        }}
        state={
          emailCheckPerformed
            ? emailValidated
              ? "success"
              : "error"
            : undefined
        }
        subtext={
          emailCheckPerformed && !emailValidated ? emailError : "Valid Email!"
        }
      />
      {!emailValidated ? (
        <Button
          className="mt-4"
          disabled={!email}
          onClick={handleEmailValidation}
        >
          Continue
        </Button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <InputWithLabel
              label="First Name"
              value={firstName}
              onChange={setFirstName}
            />
            <InputWithLabel
              label="Last Name"
              value={lastName}
              onChange={setLastName}
            />
          </div>
          <InputWithLabel
            label="Username"
            value={username}
            onChange={(v) => {
              setUsername(v);
              setUsernameError("");
            }}
            state={usernameError ? "error" : undefined}
            subtext={usernameError}
          />
          <InputWithLabel
            label="Password"
            type="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setPasswordError("");
            }}
            state={passwordError ? "error" : undefined}
            subtext={passwordError}
          />
          <Button
            disabled={
              !emailValidated ||
              !firstName ||
              !lastName ||
              !username ||
              !password
            }
            className="mt-4"
            type="submit"
          >
            Sign Up
          </Button>
          <span className="text-center text-xs text-text-secondary">
            By signing up you are agreeing to our{" "}
            <a href="/privacy">Privacy Policy</a> and{" "}
            <a href="/terms">Terms & Conditions</a>
          </span>
        </>
      )}
    </form>
  );
}

export default SignupPage;
