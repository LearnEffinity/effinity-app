import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface UsernameContextType {
  username: string | null;
  isLoading: boolean;
  lives: number;
  level: number;
  xp: number;
}

const UsernameContext = createContext<UsernameContextType | undefined>(
  undefined,
);

export function UsernameProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lives, setLives] = useState(0);
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("username, lives, level, xp")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUsername(data?.username || null);
          setLives(data?.lives || 0);
          setLevel(data?.level || 0);
        }
      }
      setIsLoading(false);
    };
    fetchUsername();
  }, []);

  return (
    <UsernameContext.Provider value={{ username, isLoading, lives, level, xp }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const context = useContext(UsernameContext);
  if (context === undefined) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
}
