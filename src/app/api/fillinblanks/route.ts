import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import onboardingDataReference from "@/utils/onboardingDataReference";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

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

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const model = bedrock("anthropic.claude-3-haiku-20240307-v1:0");

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
  sentence: string;
  correctOptions: string[];
  incorrectOptions: string[];
  explanation: string;
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

    //  console.log("Selected Goals:", selectedGoalTitles);
    //  console.log("Experience Level:", experienceLevel);
    //  console.log("Selected Interests:", selectedInterestTitles);
    //  console.log("Hobby:", hobby);

    const { object } = await generateObject({
      model,
      prompt: `Create a fill-in-the-blank activity related to budgeting. The user is interested in ${selectedGoalTitles}, with an experience level of ${experienceLevel}, and has interests in ${selectedInterestTitles}. They also have a hobby in ${hobby}. Personalize the sentence given their experience, hobby, and interests.`,
      temperature: 0.7,
      schema: z.object({
        sentence: z
          .string()
          .describe(
            "Sentence related to budgeting with two blanks. Blank words are represented by open and closed braces with the answer inside of it. For example: {budgeting}.'",
          ),
        correctOptions: z
          .array(z.string())
          .describe("The two correct words to fill the blanks."),
        incorrectOptions: z
          .array(z.string())
          .describe(
            "List of incorrect options that could fit into the blanks.",
          ),
        explanation: z
          .string()
          .describe("Explanation of the fill-in-the-blank activity."),
      }),
    });

    const formattedResponse: ResponseData = {
      sentence: object.sentence,
      correctOptions: object.correctOptions || [],
      incorrectOptions: object.incorrectOptions || [],
      explanation: object.explanation || "No explanation provided.",
    };
    return NextResponse.json<ResponseData>(formattedResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json<ResponseData>(
      {
        sentence: "",
        correctOptions: [],
        incorrectOptions: [],
        explanation: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
