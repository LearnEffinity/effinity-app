'use client'
import React from 'react';

function LoginPage() {
  return (
    <>
      <div className="loginPage flex flex-row">
        <div className="loginLeft w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
            <h1 className="text-2xl font-bold mb-4">Log In</h1>
            <p className="text-gray-500 mb-6">Take control of your financial journey.</p>
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full mb-4">
              Continue with Google
            </button>
            <p className="text-gray-500 mb-6">----- or Sign in with Email -----</p>
            <LoginForm />
            <p className="text-gray-500 mt-4">
              Don&apos;t have an account?{' '}
              <a href="/auth/signup/" className="text-blue-500 hover:text-blue-700">
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

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLoginButton = (e: any) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
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
          <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" />
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
