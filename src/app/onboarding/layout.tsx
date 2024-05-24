"use client";
import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-start mx-4 mt-8 flex flex-col sm:mx-8 sm:mt-10 md:mx-[120px] md:mt-[64px]">
      <Image width={168} height={52} src="/Effinity-Logo.svg" alt="Effinity" className="mb-6"/>
      {children}
    </div>
  );
}