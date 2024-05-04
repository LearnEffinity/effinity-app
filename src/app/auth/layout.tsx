"use client";

import { usePathname } from "next/navigation";

import Image from "next/image";

const routes = {
  "/auth/login": "Welcome back to Effinity!",
  "/auth/signup": "Ready to go to Effinity and beyond?",
  "/auth/forgot-password": "Forgot your password?",
  "/auth/reset": "Reset your password.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showImage = pathname !== "/auth/forgot-password/sent"



  return (
    <div className="grid h-full w-full lg:grid-cols-2">
      <div className="mx-auto flex w-full flex-col justify-center gap-10 place-self-center px-8 py-16 md:px-32 lg:max-w-[720px]">
        {showImage && (
          <Image width={52} height={52} src="/logo.svg" alt="Effinity" />
        )}
        {children}
      </div>
      <div className="sticky top-0 hidden h-screen w-full flex-col items-center justify-center gap-4 bg-brand-accent px-16 lg:flex">
        <span className="text-center text-4xl font-semibold text-white">
          {routes[pathname]}
        </span>
        <Image width={568} height={694} src="/auth-illustration.png" alt="" />
        <svg
          width={400}
          height={400}
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 -z-10"
        >
          <path
            d="M0 0V400H80V320H160V240H240V160H320V80H400V0H0Z"
            fill="#4D37C9"
          />
        </svg>
        <svg
          width={400}
          height={400}
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 right-0 -z-10 rotate-180"
        >
          <path
            d="M0 0V400H80V320H160V240H240V160H320V80H400V0H0Z"
            fill="#4D37C9"
          />
        </svg>
      </div>
    </div>
  );
}
