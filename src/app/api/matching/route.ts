import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});
const model = bedrock("anthropic.claude-3-haiku-20240307-v1:0");

async function fetchTopicandXp(
  userId: string,
): Promise<{ hobby: string | null; experience: string | null }> {
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

  const jsonData = data.onboardingData as any;
  const hobby = jsonData?.subHobby?.hob?.title || null;

  const xp_map = ["beginner", "intermediate", "advanced"];

  const experienceStage = jsonData?.stage2;
  const experience =
    experienceStage !== undefined ? xp_map[experienceStage] : null;

  const finalExperience = experienceStage === 2 ? experience : null;

  return { hobby, experience: finalExperience };
}

type ResponseData = {
  terms: { term: string; definition: string }[];
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
    const user_info = await fetchTopicandXp(userData.user.id);
    const user_hobby = user_info.hobby;
    const xp = user_info.experience;
    console.log(user_hobby);
    console.log(xp);

    if (!user_hobby) {
      return NextResponse.json({ message: "Hobby not found" }, { status: 404 });
    }

    const { object } = await generateObject({
      model,
      prompt: `Provide 4 terms related to effective budgeting in the context of ${user_hobby} for a user with ${xp} experience. Definitions should be around 80 characters.`,
      temperature: 0.7,
      schema: z.object({
        terms: z.array(
          z.object({
            term: z
              .string()
              .describe(
                `The term to be matched should be terms that are in the context of ${user_hobby}`,
              ),
            definition: z
              .string()
              .describe(
                `The definition of the term should be around 80 characters and related to ${user_hobby}`,
              ),
          }),
        ),
        explanation: z
          .string()
          .describe(
            `The explanation should be a short explanation of the terms and definitions in the context of ${user_hobby}`,
          ),
      }),
    });
    const formattedResponse: ResponseData = {
      terms: object.terms as { term: string; definition: string }[],
      explanation: object.explanation || "No explanation provided.",
    };

    return NextResponse.json<ResponseData>(formattedResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json<ResponseData>(
      {
        terms: [],
        explanation: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
