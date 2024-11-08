"use client";
import Image from "next/image";
import { UsernameProvider } from "@/context/UsernameContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-start mx-4 mt-8 flex max-w-[1200px] flex-col sm:mx-8 sm:mt-10 md:mt-3 xl:mx-auto">
      <Image
        width={168}
        height={52}
        src="/Effinity-Logo.svg"
        alt="Effinity"
        className="mb-6"
      />
      <UsernameProvider>{children}</UsernameProvider>
    </div>
  );
}
