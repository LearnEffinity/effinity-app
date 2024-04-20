"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

function SignupPage() {
  const supabase = createClient();
  const [emailValidated, setEmailValidated] = useState(false);
  const [email, setEmail] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function signUpWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error signing up with Google:", error);
  }

  const handleEmailValidation = () => {
    if (emailRegex.test(email)) {
      setEmailValidated(true);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <>
      <div className="signupPage flex flex-row">
        <div className="signupLeft w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <p className="text-gray-500 mb-6">
              Take control of your financial journey.
            </p>
            {!emailValidated && (
              <>
                <button
                  onClick={signUpWithGoogle}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full mb-4"
                >
                  Sign Up with Google
                </button>
                <p className="text-gray-500 mb-6">
                  ----- or Sign Up with Email -----
                </p>
              </>
            )}
            <SignupForm
              email={email}
              setEmail={setEmail}
              emailValidated={emailValidated}
              onValidateEmail={handleEmailValidation}
              supabase={supabase}

            />
            <p className="text-gray-500 mt-4">
              Already have an account?{" "}
              <a
                href="/auth/login/"
                className="text-blue-500 hover:text-blue-700"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
        <div className="signupRight"></div>
      </div>
    </>
  );
}

function SignupForm({
  email,
  setEmail,
  emailValidated,
  onValidateEmail,
  supabase,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  emailValidated: boolean;
  onValidateEmail: () => void;
  supabase: any;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSignupButton = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!passwordRegex.test(password)) {
    //   setError(
    //     "Password must contain minimum 8 characters, at least one letter and one number."
    //   );
    //   return;
    // }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          // username: username,
        },
      },
    });

    if (error) {
      setError("Failed to sign up: " + error.message);
    } else {
      setError("");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSignupButton}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      />
      {!emailValidated ? (
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
          type="button"
          onClick={onValidateEmail}
        >
          Confirm Email
        </button>
      ) : (
        <div className="flex-col">
          <div className="flex-row gap-4">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 flex-1"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 flex-1"
            />
          </div>
          <div className="flex gap-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 flex-1"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 flex-1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      )}
    </form>
  );
}

export default SignupPage;
