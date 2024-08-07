import { NextResponse } from "next/server";
import OpenAI from "openai";

type ResponseData = {
  message: string
}
 
export async function GET(
  request: Request
) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  });

  try {
    // Create a simple prompt for OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'I like to play Valorant, generate a list of 5 items, which can either be needs or wants, and send me the response in this format: // {1: name:skins, explanation: bc why would you need a skin, type:want}' }],
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content || "No response from OpenAI";

    // Return the response in the desired format
    return NextResponse.json<ResponseData>({ message });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json<ResponseData>({ message: "Internal Server Error" }, { status: 500 });
  }
}
