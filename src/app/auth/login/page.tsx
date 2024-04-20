"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
function LoginPage() {
  const supabase = createClient();
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <>
      <div className="loginPage flex flex-row">
        <div className="loginLeft w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
            <h1 className="text-2xl font-bold mb-4">Log In</h1>
            <p className="text-gray-500 mb-6">
              Take control of your financial journey.
            </p>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full mb-4"
            >
              Continue with Google
            </button>
            <p className="text-gray-500 mb-6">
              ----- or Sign in with Email -----
            </p>
            <LoginForm supabase={supabase} />
            <p className="text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/signup/"
                className="text-blue-500 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
        <div className="loginRight"></div>
      </div>
    </>
  );
}

function LoginForm({ supabase }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleLoginButton = async (e: any) => {
    e.preventDefault();
    console.log("Email:", email);
    // if (!emailRegex.test(email)) {
    //   setError("Please enter a valid email address.");
    //   return;
    // }
    // if (!passwordRegex.test(password)) {
    //   setError(
    //     "Password must contain minimum 8 characters, at least one letter and one number."
    //   );
    //   return;
    // }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Failed to login:", error.message);
      setError("Failed to login: " + error.message);
    } else {
      setError("");
    }
    console.log("Logged in:", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleLoginButton}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <label className="text-gray-500">Remember me</label>
        </div>
        <a href="/auth/signup/" className="text-blue-500 hover:text-blue-700">
          Forgot password?
        </a>
      </div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
        type="submit"
      >
        Log In
      </button>
    </form>
  );
}

export default LoginPage;
