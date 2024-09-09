import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { add } from "@dnd-kit/utilities";

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
  terms: { [key: string]: string };
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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  try {
    const user_info = await fetchTopicandXp(userData.user.id);
    const user_hobby = user_info.hobby;
    const xp = user_info.experience;
    console.log(user_hobby);
    console.log(xp);

    if (!user_hobby) {
      return NextResponse.json({ message: "Hobby not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Provide 4 terms related to effective budgeting in the context of ${user_hobby} for a user with ${xp} experience. Definitions should be around 80 characters.`,
        },
      ],
      temperature: 0.7,     
       response_format: {type: "json_object"},
       functions: [
        {
          name: "generate_budgeting_terms",
          description: "Generate 4 terms related to effective budgeting and their definitions.",
          parameters: {
            type: "object",
            properties: {
             terms: {
              type: "object",
              description: "Terms related to effective budgeting and their definitions.",
              additionalProperties: {
                type: "string",
              },
              explanation: {
                type: "string",
                description: "Explanation of the term if answered correctly.",
              }
             },
             required: ["terms", "explanation"],
            },
          },
        }
       ],
       function_call: { name: "generate_budgeting_terms" },

    });

    const m = response.choices[0]?.message?.function_call

    if (!m) {
      return NextResponse.json(
        { message: "Function call not found" },
        { status: 404 },
      );
    } 

    const message: ResponseData = JSON.parse(m.arguments);
    

    const formattedResponse: ResponseData = {
      terms: message.terms || {},
      explanation: message.explanation || "No explanation provided.",
    
    }

    return NextResponse.json<ResponseData>(formattedResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json<ResponseData>(
      {
        terms: {},
        explanation: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
