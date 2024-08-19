import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import onboardingDataReference from "@/utils/onboardingDataReference";

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
  return jsonData|| null;
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
    const userPreference = await fetchTopic(userData.user.id);
    console.log("User Preference:", userPreference);

    if (!userPreference) {
      return NextResponse.json({ message: "userPreference not found" }, { status: 404 });
    }

    const { stage1, stage2, stage3, stage4, subHobby } = userPreference;
    // console.log("User Preference Stages:", stage1, stage2, stage3, stage4, subHobby);

       // Validate and retrieve titles for stage1
       const selectedGoalTitles = stage1
       .filter((index: number) => index < onboardingDataReference.stage1.length)
       .map((index: number) => onboardingDataReference.stage1[index].title)
       .join(", ");
 
     // Validate and retrieve titles for stage2
     const experienceLevel = stage2 < onboardingDataReference.stage2.length
       ? onboardingDataReference.stage2[stage2].title
       : "Unknown Experience Level";
 
     // Validate and retrieve titles for stage3
     const selectedInterestTitles = stage3
       .filter((index: number) => index < onboardingDataReference.stage3.length)
       .map((index: number) => onboardingDataReference.stage3[index].title)
       .join(", ");
 
     // Validate and retrieve hobby
     const hobbyCategory = onboardingDataReference.stage4[stage4]?.title || "Unknown Hobby";
     const hobby = subHobby && onboardingDataReference.subHobbies[hobbyCategory]?.[subHobby.ind]?.title
       ? onboardingDataReference.subHobbies[hobbyCategory][subHobby.ind].title
       : "Unknown Hobby";
 
    //  console.log("Selected Goals:", selectedGoalTitles);
    //  console.log("Experience Level:", experienceLevel);
    //  console.log("Selected Interests:", selectedInterestTitles);
    //  console.log("Hobby:", hobby);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
          I am creating a fill-in-the-blank activity related to budgeting. The user is interested in ${selectedGoalTitles}, with an experience level of ${experienceLevel}, and has interests in ${selectedInterestTitles}. They also have a hobby in ${hobby}. Please provide a sentence related to budgeting with two blanks, along with the correct words to fill those blanks.Personalize it given their experience, hobby and so on. Also, provide a list of incorrect options that could fit into the blanks. Return the response in this format: 
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
