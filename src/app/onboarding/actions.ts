'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { OnboardingStage, OnboardingData, UserData } from './types';

export async function fetchSession(): Promise<{ user: any; userData: UserData | null }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data, error } = await supabase
      .from("users")
      .select("username, onboardingStage, onboardingData")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return { user: null, userData: null };
    }

    return { user, userData: data };
  }

  return { user: null, userData: null };
}

export async function saveOnboardingData(nextStage: OnboardingStage, data: Partial<OnboardingData>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No authenticated user found");
  }

  try {
    const { data: updatedData, error } = await supabase
      .from("users")
      .update({
        onboardingData: data,
        onboardingStage: nextStage,
      })
      .eq("id", user.id)
      .select();

    if (error) {
      throw error;
    }

    revalidatePath('/onboarding');
    return updatedData[0];
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
}

export async function saveUsername(username: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No authenticated user found");
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ username })
      .eq("id", user.id)
      .select();

    if (error) {
      throw error;
    }

    revalidatePath('/onboarding');
    return data[0];
  } catch (error) {
    console.error("Error saving username:", error);
    throw error;
  }
}