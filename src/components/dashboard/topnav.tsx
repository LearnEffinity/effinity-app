import React, { useState, useEffect } from "react";
import SearchBar from "./learn/searchbar";
import { createClient } from "@/utils/supabase/client";

export default function TopNav() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching profile", error);
      } else if (user) {
        setProfile(user);
      }
    };
    fetchProfile();
  }, []);

  const handleSearch = (searchTerm: string) => {
    // !do something
  };

  return (
    <div className="flex w-full flex-row justify-between">
      <div className="w-1/2">
        <SearchBar
          placeholder="Search for financial topics that interest you"
          onSearch={handleSearch}
        />
      </div>
      {profile && <TopProfileDetails profile={profile} />}
    </div>
  );
}

export const TopProfileDetails = ({ profile }) => {
  return (
    <div className="flex flex-row items-center gap-x-5">
      <div className="flex items-center gap-x-1">
        <img className="h-7 w-7" src="/icons/heart.svg" alt="lives" />
        <p className="text-lg font-medium text-text-secondary">5</p>
      </div>
      <div className="grid !h-[60px] max-w-[200px] grid-cols-[36px_1fr] items-center gap-x-4 overflow-hidden rounded-xl border px-4">
        <div className="flex h-9 w-full items-center justify-center rounded-full border border-brand-primary bg-white/0">
          <div className="relative h-8 w-8 rounded-full bg-green-500" />
        </div>
        <div className="flex w-[116px] flex-col items-start gap-y-1 overflow-ellipsis">
          <h1 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium text-text-primary">
            {profile?.username || "User"}
          </h1>
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal text-text-secondary">
            Level 0
          </p>
        </div>
      </div>
    </div>
  );
};
