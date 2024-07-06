"use client";
import { createClient } from "@/utils/supabase/client";

export default function SignOutPage() {
  const supabase = createClient();
  supabase.auth.signOut();
  const redirect = "/auth/login";
  window.location.replace(redirect);

  return null;
}
