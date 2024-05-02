"use client";
import { createClient } from "./supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const supabaseClient = createClient();

export const AuthContext = createContext({
  user: null,
  session: null,
  client: supabaseClient,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    const currentSession = supabaseClient.auth.getSession();
    setSession(currentSession);
    setUser(currentSession?.user || null);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   if (user && pathname.startsWith("/auth")) {
  //     router.push("/");
  //   } else if (!user && !pathname.startsWith("/auth")) {
  //     router.push("/auth/login");
  //   }
  // }, [user, router]);
  useEffect(() => {
    if (
      user &&
      pathname.startsWith("/auth") &&
      !pathname.startsWith("/auth/reset")
    ) {
      router.push("/");
    } else if (
      !user &&
      !pathname.startsWith("/auth") &&
      !pathname.startsWith("/auth/reset")
    ) {
      router.push("/auth/login");
    }
  }, [user, router]);
  return (
    <AuthContext.Provider value={{ user, session, client: supabaseClient }}>
      {children}
    </AuthContext.Provider>
  );
};
