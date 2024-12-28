import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import onboardingDataReference from "@/utils/onboardingDataReference";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface UserPreference {
  stage1: number[];
  stage2: number;
  stage3: number[];
  stage4: number;
  subHobby: {
    hob: {
      image: string;
      title: string;
    };
    ind: number;
  };
}

async function fetchTopic(userId: string): Promise<UserPreference | null> {
  const supabase = createServerSupabaseClient(cookies());
  const { data, error } = await supabase
    .from("users")
    .select("onboardingData")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return null;
  }

  return (data.onboardingData as UserPreference) || null;
}

type ResponseData = {
  items: Array<{
    text: string;
    category: "needs" | "wants";
  }>;
  explanation: string;
};

export async function GET(
  request: Request,
  { params }: { params: { topic: string; module_number: string; lesson_number: string } }
) {
  const supabase = createServerSupabaseClient(cookies());

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 },
      );
    }

    const userPreference = await fetchTopic(userData.user.id);
    if (!userPreference) {
      return NextResponse.json(
        { message: "User preferences not found" },
        { status: 404 },
      );
    }

    const { topic, module_number, lesson_number } = params;

    // Fetch lesson data
    const lessonResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/lesson/${topic}/${module_number}/${lesson_number}`,
      { cache: "no-store" },
    );
    const lessonData = await lessonResponse.json();

    if (!lessonResponse.ok || !lessonData) {
      return NextResponse.json(
        { message: "Failed to fetch lesson data" },
        { status: 500 },
      );
    }

    const hobby = userPreference.subHobby?.hob?.title || "general";
    const experienceLevel = 
      userPreference.stage2 < onboardingDataReference.stage2.length
        ? onboardingDataReference.stage2[userPreference.stage2].title
        : "beginner";

    const { object } = await generateObject({
      model: anthropic("claude-3-haiku-20240307"),
      schema: z.object({
        items: z.array(z.object({
          text: z.string().max(30),
          category: z.enum(["needs", "wants"]),
        })).length(5),
        explanation: z.string(),
      }),
      messages: [
        {
          role: "system",
          content: "You are a financial education assistant that creates engaging learning activities.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a sorting activity about ${lessonData.name} related to ${hobby}.
              Generate 5 items total (3 needs and 2 wants) that a ${hobby} enthusiast would understand.
              Each item should be max 30 characters.
              Needs are essential items/concepts for ${lessonData.name}, while wants are optional/luxury items.
              Adjust the complexity for ${experienceLevel} level.
              Include a brief explanation about why each item is categorized as it is.`,
            },
          ],
        },
      ],
      temperature: 0.7,
    }) as { object: ResponseData };

    return NextResponse.json(object);

  } catch (error) {
    console.error("Error in sorting activity:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
} 