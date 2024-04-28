"use client";
import { createClient } from "@/utils/supabase/client";

export default function SignOutPage() {
  const supabase = createClient();
  supabase.auth.signOut();

  return null;
}
