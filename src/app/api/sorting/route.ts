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

async function fetchTopic(userId: string): Promise<string | null> {
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
  return jsonData?.subHobby?.hob?.title || null;
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

  // console.log("Authenticated User Data:", userData.user);

  try {
    const title = await fetchTopic(userData.user.id);

    if (!title) {
      return NextResponse.json({ message: "Title not found" }, { status: 404 });
    }

    const { object } = await generateObject({
      model,
      prompt: `Generate a list of 5 items related to ${title}, consisting of 3 needs and 2 wants.

Needs: Essential items or equipment that are absolutely necessary to participate in ${title} at a basic level. These should be the bare minimum requirements without which the activity cannot be performed safely or effectively.

Wants: Non-essential items that enhance the experience of ${title} but are not strictly necessary. These could be items for comfort, convenience, or to improve performance beyond the basics.

Please ensure all items are directly relevant to ${title} and provide a clear distinction between needs and wants. Include specific, tangible items rather than general concepts.`,
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
