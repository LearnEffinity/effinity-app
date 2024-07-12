import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ResetPasswordForm = dynamic(
  () => import("@/components/form/ResetPassword"),
  {
    ssr: false,
  },
);

export default function ResetPasswordPage() {
  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <hgroup className="flex flex-col gap-1">
        <h1 className="text-4xl font-semibold">Reset Your Password</h1>
      </hgroup>
      <Suspense fallback={<p>Loading form...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
