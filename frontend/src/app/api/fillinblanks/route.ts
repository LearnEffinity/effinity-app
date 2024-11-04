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
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const topic = pathParts[2];
    const moduleNumber = pathParts[3];

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
      prompt: `Your goal is to optimize the initial prompt to achieve accurate and informative responses from ChatGPT. You possess a deep understanding of GPT models and can guide them effectively. Keep your prompts professional and concise. Ensure that the responses are relevant to the desired goal and provide helpful information.  



Goal: Act as a financial literacy bot. Help me learn about ${topicInfo.topic}: ${topicInfo.moduleTitle} - ${topicInfo.lessonTitle} as a person with a short attention span by creating an activity and keep everything engaging.  



Parameters/Rules: Explain the financial literacy topic in terms that relate to ${user_hobby}.  The activity should be a fill-in-the-blank activity where terms should be matched to the correct definition that is explained in ${user_hobby} terminology. The difficulty level of this activity should be for a user with ${xp} experience. Make sure that there is only 1 sentence that is short and sweet to fit in 2 blanks.  



Additional Context: For the activity, a user is given one sentence with 2 blanks that they must use a word bank in order to fill relating to ${topicInfo.topic}: ${topicInfo.moduleTitle} - ${topicInfo.lessonTitle}. Give the user at least 4 different words to fill into the blanks (2 incorrect terms, 2 correct terms). Do not tell the user which are which, the user must figure it out on their end. Needs are things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort, while wants are other items. Definitions and terms should be around 80 characters.`,

      temperature: 0.7,
      schema: z.object({
        sentence: z
          .string()
          .describe(
            "Sentence related to budgeting with two blanks. Blank words are represented by open and closed braces with the answer inside of it. For example: {budgeting}. Make sure the sentence is short and sweet to fit in 2 blanks.",
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
