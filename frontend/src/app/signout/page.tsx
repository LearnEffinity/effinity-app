"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      router.push("/auth/login");
    };
    signOut();
  }, []);

  return <p>Signing out...</p>;
}
