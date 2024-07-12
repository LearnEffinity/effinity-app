"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
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
          {children}
          {/* MAIN CONTENT */}
        </div>
      </main>
    </div>
  );
}
