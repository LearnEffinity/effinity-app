import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import onboardingDataReference from "@/utils/onboardingDataReference";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const model = bedrock("anthropic.claude-3-haiku-20240307-v1:0");

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
  Needs?: string[];
  Wants?: string[];
  Explanation?: string;
};

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient(cookies());

  // Get the user data from Supabase using the auth.getUser method
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user data:", userError);
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 },
    );
  }

  try {
    const userPreference = await fetchTopic(userData.user.id);
    console.log("User Preference:", userPreference);

    if (!userPreference) {
      return NextResponse.json(
        { message: "userPreference not found" },
        { status: 404 },
      );
    }

    // Extract topic and module number from the request URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const topic = pathParts[2]; // 'budgeting' in your example
    const moduleNumber = pathParts[3]; // '1' in your example

    if (!topic || !moduleNumber) {
      return NextResponse.json(
        { message: "Topic or module number not provided" },
        { status: 400 },
      );
    }

    // Fetch the current topic information using the new API endpoint
    const topicResponse = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/getCurrentTopic/${topic}/${moduleNumber}`,
      { cache: "no-store" },
    );
    const topicInfo = await topicResponse.json();

    if (!topicResponse.ok || !topicInfo) {
      return NextResponse.json(
        { message: "Failed to fetch current topic" },
        { status: 500 },
      );
    }

    const { stage1, stage2, stage3, stage4, subHobby }: UserPreference =
      userPreference;
    // console.log("User Preference Stages:", stage1, stage2, stage3, stage4, subHobby);

    // Validate and retrieve titles for stage1
    const selectedGoalTitles = stage1
      .filter((index: number) => index < onboardingDataReference.stage1.length)
      .map((index: number) => onboardingDataReference.stage1[index].title)
      .join(", ");

    // Validate and retrieve titles for stage2
    const experienceLevel =
      stage2 < onboardingDataReference.stage2.length
        ? onboardingDataReference.stage2[stage2].title
        : "Unknown Experience Level";

    // Validate and retrieve titles for stage3
    const selectedInterestTitles = stage3
      .filter((index: number) => index < onboardingDataReference.stage3.length)
      .map((index: number) => onboardingDataReference.stage3[index].title)
      .join(", ");

    // Validate and retrieve hobby
    const hobbyCategory =
      onboardingDataReference.stage4[stage4]?.title || "Unknown Hobby";
    const hobby =
      subHobby &&
      onboardingDataReference.subHobbies[hobbyCategory]?.[subHobby.ind]?.title
        ? onboardingDataReference.subHobbies[hobbyCategory][subHobby.ind].title
        : "Unknown Hobby";

    const { object } = await generateObject({
      model,
      prompt: `Your goal is to optimize the initial prompt to achieve accurate and informative responses from ChatGPT. You possess a deep understanding of GPT models and can guide them effectively. Keep your prompts professional and concise. Ensure that the responses are relevant to the desired goal and provide helpful information.  

Goal: Act as a financial literacy bot. Help me learn about ${topicInfo.topic}: ${topicInfo.moduleTitle} - ${topicInfo.lessonTitle} as a person with a short attention span by creating an activity and keep everything engaging.  

Parameters/Rules: Explain the financial literacy topic in terms that relate to ${hobby}. The activity should be a sorting activity where terms should be matched to the correct definition that is explained in ${hobby} terminology. The difficulty level of this activity should be for a user with ${experienceLevel} experience.  

Additional Context: For the activity, generate a list of 5 items of 2 wants and 3 needs based on ${topicInfo.topic}: ${topicInfo.moduleTitle} - ${topicInfo.lessonTitle}. Do not tell the user which are which, the user must figure it out on their end. Needs are things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort, while wants are other items. The terms should be around 30 characters or less.`,
      temperature: 0.7,
      schema: z.object({
        Needs: z
          .array(z.string())
          .describe(
            "Things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort.",
          ),
        Wants: z
          .array(z.string())
          .describe("Other items that are not an absolute necessity."),
        Explanation: z.string().describe("Explanation of the generated list."),
      }),
    });

    const formattedResponse: ResponseData = {
      Needs: object.Needs || [],
      Wants: object.Wants || [],
      Explanation: object.Explanation || "No explanation provided.",
    };

    return NextResponse.json<ResponseData>(formattedResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json<ResponseData>(
      { Needs: [], Wants: [], Explanation: "Internal Server Error" },
      { status: 500 },
    );
  }
}
