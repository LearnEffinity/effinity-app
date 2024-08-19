import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function fetchTopicandXp(userId: string): Promise<{ hobby: string | null, experience: string | null }> {
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
  const hobby = jsonData?.subHobby?.hob?.user_hobby || null;

  const xp_map = ["beginner", "intermediate", "advanced"];
  
  const experienceStage = jsonData?.subHobby?.hob?.experience?.stage;
  const experience = experienceStage !== undefined ? xp_map[experienceStage] : null;

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
      { status: 401 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  });

  try {
    const user_info = await fetchTopicandXp(userData.user.id);
    const user_hobby = user_info.hobby;
    const xp = user_info.experience;

    if (!user_hobby) {
      return NextResponse.json({ message: "Hobby not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
          Please provide 4 terms related to effective budgeting in the context of ${user_hobby} and their corresponding definitions. 
          Assume that the user has ${xp} experience. These definitions shouldn't be too long, around 80 characters. 
          Return the terms/definitions, along with an explanation of each one if answer correctly, in this format.
          {
            terms: { [key: string]: string },
            explanation: string
          }
          `,
        },
      ],
      temperature: 0.7,
    });

    const message =
      response.choices[0]?.message?.content || "No response from OpenAI";

    let parsedResponse: ResponseData;

    try {
      parsedResponse = JSON.parse(message);
      console.log("Parsed OpenAI Response:", parsedResponse);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return NextResponse.json(
        {
          terms: {},
          explanation: "Invalid response format",
        },
        { status: 400 }
      );
    }

    const formattedResponse: ResponseData = {
      terms: parsedResponse.terms || {},
      explanation: parsedResponse.explanation || "No explanation provided.",
    };

    return NextResponse.json<ResponseData>(formattedResponse);
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json<ResponseData>(
      {
        terms: {},
        explanation: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}