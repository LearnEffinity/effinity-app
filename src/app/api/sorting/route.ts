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
    apiKey: process.env.OPENAI_API_KEY!,
  });

  try {
    const title = await fetchTopic(userData.user.id);

    if (!title) {
      return NextResponse.json({ message: "Title not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `I like to ${title}, generate a list of 6 items of 3 wants and 3 needs. Needs are things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort, while wants are other items.`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
      functions: [
        {
          name: "generate_wants_and_needs",
          description: "Generate a list of 6 items of 3 wants and 3 needs.",
          parameters: {
            type: "object",
            properties: {
              Needs: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort.",
              },
              Wants: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Other items that are not an absolute necessity.",
              },
              Explanation: {
                type: "string",
                description: "Explanation of the generated list.",
              },
            },
            required: ["Needs", "Wants", "Explanation"],
          },
        },
      ],
      function_call: { name: "generate_wants_and_needs" },
    });

    const functionCall = response.choices[0]?.message?.function_call;

    if (!functionCall) {
      return NextResponse.json(
        { Needs: [], Wants: [], Explanation: "Invalid response format" },
        { status: 400 },
      );
    }

    let parsedResponse: ResponseData = JSON.parse(functionCall.arguments);

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
