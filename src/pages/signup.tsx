'use client'
import React from 'react';
import "./globals.css";

function SignupPage() {
  return (
    <>
      <div className="signupPage flex flex-row">
        <div className="signupLeft w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <p className="text-gray-500 mb-6">Take control of your financial journey.</p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full mb-4">
              Sign Up with Google
            </button>
            <p className="text-gray-500 mb-6">----- or Sign Up with Email -----</p>
            <SignupForm />
            <p className="text-gray-500 mt-4">
              Already have an account?{' '}
              <a href="/auth/login/" className="text-blue-500 hover:text-blue-700">
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

function SignupForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignupButton = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
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
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}

export default SignupPage;
