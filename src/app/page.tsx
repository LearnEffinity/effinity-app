"use client";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";

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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">
              Welcome{" "}
              {user
                ? user.user_metadata.name || user.user_metadata.first_name
                : "Loading..."}
            </h1>
            <a
              className="rounded-lg bg-brand-primary px-4 py-2 text-white"
              href="/signout"
            >
              Sign out
            </a>
          </div>
          {/* Add your main content here */}
        </div>
      </main>
    </div>
  );
}
