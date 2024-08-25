import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  });

  try {
    const title = await fetchTopic(userData.user.id);

    if (!title) {
      return NextResponse.json({ message: "Title not found" }, { status: 404 });
    }

    // generate only 5 items and randomize the number of wants and needs, add a minimum 1 item per category though
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `I like to ${title}, generate a list of 6 items of 3 wants and 3 needs. Needs are things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort, while wants are other items, and send me the response in this format: {"Needs": ["Item1", "Item2"], "Wants": ["Item1", "Item2"], "Explanation": "Explanation only if the user does everything correctly."}`,
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
        { Needs: [], Wants: [], Explanation: "Invalid response format" },
        { status: 400 },
      );
    }

    const formattedResponse: ResponseData = {
      Needs: parsedResponse.Needs || [],
      Wants: parsedResponse.Wants || [],
      Explanation: parsedResponse.Explanation || "No explanation provided.",
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
