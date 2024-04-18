'use client'
import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginButton = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    console.log('Email:', email)
    console.log('Password:', password)
  }
  return (
    <>
    <div className="loginPage flex flex-row">
    <div className="loginLeft w-1/2 flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <p className="text-gray-500 mb-6">Take control of your financial journey.</p>
        <Button variant="contained" color="primary" className="w-full mb-4">
          Continue with Google
        </Button>
        <p className="text-gray-500 mb-6">----- or Sign in with Email -----</p>
        <form className="flex flex-col gap-4" onSubmit={handleLoginButton}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            className="w-full"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            variant="outlined"
            className="w-full"
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox />
              <FormControlLabel label="Remember me" control={<></>} />
            </div>
            <a href="/auth/signup/" className="text-blue-500 hover:text-blue-700">
              Forgot password?
            </a>
          </div>
          <Button variant="contained" color="primary" className="w-full" type='submit'>
            Log In
          </Button>
        </form>
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
  )
}

export default LoginPage