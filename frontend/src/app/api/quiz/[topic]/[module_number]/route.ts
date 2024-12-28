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
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
};

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { topic: string; module_number: string };
  },
) {
  const supabase = createServerSupabaseClient(cookies());

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("Error fetching user data:", userError);
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 },
      );
    }

    const userPreference = await fetchTopic(userData.user.id);
    if (!userPreference) {
      console.error("User preferences not found");
      return NextResponse.json(
        { message: "User preferences not found" },
        { status: 404 },
      );
    }

    const { topic, module_number } = params;

    // Fetch module data
    const ModuleResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/module/${topic}/${module_number}`,
      { cache: "no-store" },
    );
    const ModuleData = await ModuleResponse.json();

    if (!ModuleResponse.ok || !ModuleData) {
      console.error("Failed to fetch module data");
      return NextResponse.json(
        { message: "Failed to fetch module data" },
        { status: 500 },
      );
    }

    console.log("ModuleData", ModuleData);

    const hobby = userPreference.subHobby?.hob?.title || "general";
    const experienceLevel =
      userPreference.stage2 < onboardingDataReference.stage2.length
        ? onboardingDataReference.stage2[userPreference.stage2].title
        : "beginner";

    const { object } = (await generateObject({
      model: anthropic("claude-3-haiku-20240307"),
      schema: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            correctAnswer: z.number(),
            explanation: z.string(),
          }),
        ),
      }),
      messages: [
        {
          role: "system",
          content:
            "You are a financial education assistant that creates engaging learning activities.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Create a quiz activity about ${ModuleData.module.name} related to ${hobby}.
              Generate 3 questions that a ${hobby} enthusiast would understand.
              Each question should be max 30 characters.
              Needs are essential items/concepts for ${ModuleData.module.name}, while wants are optional/luxury items.
              Adjust the complexity for ${experienceLevel} level.
              Include a brief explanation about why each item is categorized as it is.`,
            },
          ],
        },
      ],
      temperature: 0.7,
    })) as { object: ResponseData };

    console.log("object", object);

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error in quiz activity:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
