import React from "react";
import SearchBar from "./learn/searchbar";
export default function TopNav() {
  //
  const handleSearch = (searchTerm: string) => {
    // !do something
  };
  //
  return (
    <>
      <div className="flex w-full flex-row justify-between">
        <div className="w-1/2">
          <SearchBar
            placeholder="Search for financial topics that interest you"
            onSearch={handleSearch}
          />
        </div>
        <TopProfileDetails />
      </div>
    </>
  );
}

const TopProfileDetails = () => {
  return (
    <div className="flex flex-row items-center gap-x-5">
      <div className="flex items-center gap-x-1">
        <img className="h-7 w-7" src="/icons/heart.svg" alt="lives" />
        <p className="text-lg font-medium text-text-secondary">5</p>
      </div>
      <div className="flex h-[60px] w-[168px] flex-row items-center gap-x-2 rounded-xl border px-4 py-2">
        <div className="rounded-full border border-brand-primary bg-white/0 p-[2px]">
          <div className="relative h-8 w-8 rounded-full bg-green-500" />
        </div>
        <div className="flex flex-col items-start gap-y-1">
          <h1 className="text-base font-medium text-text-primary">Username</h1>
          <p className="text-xs font-normal text-text-secondary">Level 0</p>
        </div>
      </div>
    </div>
  );
};
