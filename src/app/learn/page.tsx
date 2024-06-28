"use client";
import React from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar currentRoute={pathname} />
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto ">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-5xl font-bold text-brand-quaternary">
              LEARN PAGE
            </h1>
          </div>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit
            assumenda quos sit quas omnis impedit praesentium corrupti, autem
            nostrum sequi eaque molestias mollitia quam. Quae tempora quas
            quisquam deserunt nobis! Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Quod cupiditate ipsa reprehenderit eligendi
            corporis dolorum! Omnis quidem eos sed in necessitatibus ut?
            Inventore molestiae aspernatur quia repudiandae alias, illum
            repellendus.
          </p>
        </div>
      </main>
    </div>
  );
}
