import React from "react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <>
      <nav className="flex flex-col px-8 ">
        <Image
          alt="Effinity Logo"
          src="/effinity-logo.png"
          width={156}
          height={40}
        />
      </nav>
    </>
  );
}
