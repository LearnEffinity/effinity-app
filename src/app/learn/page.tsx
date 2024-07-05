"use client";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Continue from "@/components/dashboard/learn/continue";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar currentRoute={pathname} />
      <main className="flex-1 px-8 py-10">
        {/* MAIN CONTENT */}
        <div className="mx-auto ">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-5xl font-bold text-brand-quaternary">
              LEARN PAGE
            </h1>
          </div>
          <Continue />
        </div>
        {/* MAIN CONTENT */}
      </main>
    </div>
  );
}
