import React from "react";
import SortingCard from "./SortingCard";

interface SortingActivityProps {}

interface SortingCardProps {
  icon: string;
  item: string;
}

const SortingCardData: SortingCardProps[] = [
  {
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
  {
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
  {
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
  {
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
  {
    icon: "/activity/wrench.png",
    item: "Utilities",
  },
];

export default function SortingActivity() {
  return (
    <>
      <div className="flex flex-col items-start  px-36 pb-14">
        <div className=" pb-8 pt-10">
          <h3 className="text-xl font-medium">Sorting</h3>
          <h1 className="text-4xl font-medium text-text-primary">
            Distinguished between {"Needs"} and {"Wants"}
          </h1>
          <h2>Sort each option into the correct category.</h2>
        </div>
        {/* That actual activity stuff */}
        <div className="flex flex-col items-start gap-y-4">
          {SortingCardData.map((item, index) => (
            <SortingCard key={index} icon={item.icon} item={item.item} />
          ))}
        </div>
      </div>
    </>
  );
}
