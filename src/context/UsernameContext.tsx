// context/UsernameContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface UsernameContextType {
  username: string | null;
  setUsername: (username: string) => Promise<void>;
  isLoading: boolean;
}

const UsernameContext = createContext<UsernameContextType | undefined>(
  undefined,
);

export const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching username:", error);
        } else {
          setUsernameState(data?.username || null);
        }
      }
      setIsLoading(false);
    };

    fetchUsername();
  }, []);

  const setUsername = async (newUsername: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ username: newUsername })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating username:", error);
      } else {
        setUsernameState(newUsername);
      }
    }
  };

  return (
    <UsernameContext.Provider value={{ username, setUsername, isLoading }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = (username?: string) => {
  const context = useContext(UsernameContext);
  if (context === undefined) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
