"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const [sidebarWidth, setSidebarWidth] = useState(245);

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) console.error("Error fetching user:", error);
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
      <Sidebar
        currentRoute={pathname}
        onWidthChange={handleSidebarWidthChange}
      />
      <main
        className="flex-1 px-8 py-10"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto ">
          <div className="mb-8 flex flex-col items-center justify-center gap-y-20">
            <h1 className="text-4xl font-bold">
              Welcome{" "}
              {user
                ? user.user_metadata.username || user.user_metadata.full_name
                : "Loading..."}
            </h1>
            <a
              className="rounded-lg bg-brand-primary px-4 py-2 text-white"
              href="/signout"
            >
              Sign out
            </a>
          </div>
          {/* content here */}
        </div>
      </main>
    </div>
  );
}
