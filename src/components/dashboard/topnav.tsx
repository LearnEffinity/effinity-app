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

const TopProfileDetails = ({ profile }) => {
  return (
    <div className="flex flex-row items-center gap-x-5">
      <div className="flex items-center gap-x-1">
        <img className="h-7 w-7" src="/icons/heart.svg" alt="lives" />
        <p className="text-lg font-medium text-text-secondary">5</p>
      </div>
      <div className="flex h-[60px] w-[168px] flex-row items-center gap-x-2 rounded-xl border px-4 py-8">
        <div className="rounded-full border border-brand-primary bg-white/0 p-[2px]">
          <div className="relative h-8 w-8 rounded-full bg-green-500" />
        </div>
        <div className="flex flex-col items-start gap-y-1 overflow-ellipsis">
          <h1 className="overflow-hidden text-base font-medium text-text-primary">
            {profile.user_metadata?.name ||
              profile.user_metadata?.first_name ||
              profile.user_metadata?.full_name ||
              "User"}
          </h1>
          <p className="text-xs font-normal text-text-secondary">Level 0</p>
        </div>
      </div>
    </div>
  );
};
