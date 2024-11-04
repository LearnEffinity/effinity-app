import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface TopicInfo {
  topic: string;
  moduleTitle: string;
  lessonTitle: string;
}

export async function GET(
  request: Request,
  { params }: { params: { topic: string; module_number: string } },
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { topic, module_number } = params;

  if (!topic || !module_number) {
    return NextResponse.json(
      { error: "Topic or module number not provided" },
      { status: 400 },
    );
  }

  try {
    const { data: moduleData, error: moduleError } = await supabase
      .from("modules")
      .select("title")
      .eq("topic", topic)
      .eq("module_number", module_number)
      .single();

    if (moduleError) throw moduleError;

    const { data: lessonData, error: lessonError } = await supabase
      .from("lessons")
      .select("title")
      .eq("topic", topic)
      .eq("module_number", module_number)
      .order("lesson_number")
      .limit(1)
      .single();

    if (lessonError) throw lessonError;

    const topicInfo: TopicInfo = {
      topic: topic,
      moduleTitle: moduleData.title,
      lessonTitle: lessonData.title,
    };

    return NextResponse.json(topicInfo);
  } catch (error) {
    console.error("Error fetching current topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch current topic" },
      { status: 500 },
    );
  }
}
