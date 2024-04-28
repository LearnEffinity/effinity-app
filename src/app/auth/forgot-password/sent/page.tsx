export default function ForgotPasswordSentPage() {
  return (
    <div className="forgotPasswordSentPage flex flex-row">
      <div className="flex flex-col justify-center items-center h-screen w-1/2">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4">Password Reset Email Sent</h1>
          <p className="text-gray-500 mb-6">
            If the email address you entered is associated with an account, you
            should receive an email with instructions on how to reset your
            password.
          </p>
          <a
            href="/auth/login/"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
          >
            Back to Log In
          </a>
        </div>
      </div>
      <div className="forgotpageRight w-1/2"></div>
    </div>
  );
}
