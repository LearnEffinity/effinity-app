import React from "react";
import Image from "next/image";

interface SortingCardProps {
  icon: string;
  item: string;
}

export default function SortingCard({ icon, item }: SortingCardProps) {
  return (
    <>
      <div className="w-[328px] rounded-md bg-surface-base px-5 py-[18px] text-text-primary">
        <div className="flex items-center justify-start">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-primary ">
            <Image alt="icon" width={40} height={40} src={icon} />
          </div>
          <h1 className="pl-4 text-xl font-medium">{item}</h1>
        </div>
      </div>
    </>
  );
}
