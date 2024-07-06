"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Continue from "@/components/dashboard/learn/continue";
import Recommended from "@/components/dashboard/learn/recommended";
import { usePathname } from "next/navigation";
import TopNav from "@/components/dashboard/topnav";

export default function Home() {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(245);

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  return (
    <div className="flex min-h-screen">
      <div className="fixed">
        <Sidebar
          currentRoute={pathname}
          onWidthChange={handleSidebarWidthChange}
        />
      </div>
      <main className="flex-1" style={{ marginLeft: `${sidebarWidth}px` }}>
        <div className="px-8 py-10">
          {/* MAIN CONTENT */}
          <div className="mx-auto ">
            <div className="mb-8 flex items-center justify-between">
              <TopNav />
            </div>
            <Continue />
            <Recommended />
          </div>
          {/* MAIN CONTENT */}
        </div>
      </main>
    </div>
  );
}
