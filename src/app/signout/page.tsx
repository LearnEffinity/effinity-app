"use client";
import { createClient } from "@/utils/supabase/client";

export default function SignOutPage() {
  const supabase = createClient();
  supabase.auth.signOut();

  window.location.href = "/auth/login";

  return null;
}
