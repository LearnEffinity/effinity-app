"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-start mx-4 mt-8 flex flex-col sm:mx-8 sm:mt-10 md:mx-[120px] md:mt-[64px]">
      <Image width={168} height={52} src="/Effinity-Logo.svg" alt="Effinity" />
      <ProgressBar stage={1} totalStage={3} />
      {children}
    </div>
  );
}

function ProgressBar({
  stage,
  totalStage,
}: {
  stage: number;
  totalStage: number;
}) {
  const progress = (stage / totalStage) * 100;
  return (
    <div className="h-2 w-full rounded bg-surface-base">
      <motion.div
        className="h-2 rounded bg-brand-accent"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
