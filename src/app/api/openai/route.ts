import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from "openai";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function fetchTopic(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('onboardingData')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching data from Supabase:', error);
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

export async function GET(request: Request,
  { params }: { params: { userId: string} },
  ) {

  if (!params.userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  });

  try {
    const title = await fetchTopic(params.userId);

    if (!title) {
      return NextResponse.json({ message: "Title not found" }, { status: 404 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `I like to ${title}, generate a list of 6 items of 3 wants and 3 needs. Needs are things that are an absolute necessity to do the bare minimum for this activity, and does not include things for comfort, while wants are other items, and send me the response in this format: {"Needs": ["Item1", "Item2"], "Wants": ["Item1", "Item2"], "Explanation": "Explanation only if the user does everything correctly."}`,
        }
      ],
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content || "No response from OpenAI";

    let parsedResponse: ResponseData;

    try {
      parsedResponse = JSON.parse(message);

    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json<ResponseData>({ message: "Invalid response format" }, { status: 400 });
    }

    const formattedResponse: ResponseData = {
      Needs: parsedResponse.Needs || [],
      Wants: parsedResponse.Wants || [],
      Explanation: parsedResponse.Explanation || "No explanation provided.",
    };

    return NextResponse.json<ResponseData>(formattedResponse);
    
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json<ResponseData>({ message: "Internal Server Error" }, { status: 500 });
  }
}
