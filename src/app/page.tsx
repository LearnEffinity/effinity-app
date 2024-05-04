"use client";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user as User);
        console.log("User:", data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    getUser();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex">

        <h1 className="text-[50px]">Welcome  {user
          ? user.user_metadata.name || user.user_metadata.first_name
          : "Loading..."}</h1>
        <a className="py-4 px-8 text-center bg-brand-primary text-white rounded-lg" href="/signout">Sign out</a>
      </div>
    </main>
  );
}
