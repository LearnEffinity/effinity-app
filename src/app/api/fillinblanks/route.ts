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
      { status: 401 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
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
          content: `
          I am creating a fill-in-the-blank activity for budgeting. Please provide a sentence related to budgeting with two blanks, along with the correct words to fill those blanks. Also, provide a list of incorrect options that could fit into the blanks. Return the response in this format: 
          {
            "sentence": "Effective budgeting involves prioritizing {1} to achieve financial goals while managing {2} to maintain financial health.",
            "correctOptions": ["example", "test"],
            "incorrectOptions": ["investments", "income", "debts", "loans"],
            "explanation": "Effective budgeting requires careful management of expenses to achieve financial goals while ensuring savings to maintain financial stability."
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
          sentence: "",
          correctOptions: [],
          incorrectOptions: [],
          explanation: "Invalid response format",
        },
        { status: 400 }
      );
    }

    const formattedResponse: ResponseData = {
      sentence: parsedResponse.sentence,
      correctOptions: parsedResponse.correctOptions || [],
      incorrectOptions: parsedResponse.incorrectOptions || [],
      explanation: parsedResponse.explanation || "No explanation provided.",
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
      { status: 500 }
    );
  }
}
