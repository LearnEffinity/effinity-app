"use client";

import React from "react";
import Continue from "@/components/dashboard/learn/continue";
import Recommended from "@/components/dashboard/learn/recommended";
import TopNav from "@/components/dashboard/topnav";

export default function Home() {
  return (
    <>
      {/* MAIN CONTENT */}
      <div className="mx-auto ">
        <div className="mb-8 flex items-center justify-between">
          <TopNav />
        </div>
        <Continue />
        <Recommended />
      </div>
      {/* MAIN CONTENT */}
    </>
  );
}
