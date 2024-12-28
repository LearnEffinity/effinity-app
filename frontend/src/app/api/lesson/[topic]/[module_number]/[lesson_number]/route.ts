import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { topic: string; module_number: string; lesson_number: string } },
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: lessonData, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_number", params.module_number)
    .eq("topic", params.topic)
    .eq("lesson_number", params.lesson_number)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Error fetching lesson data" },
      { status: 500 },
    );
  }

  return NextResponse.json(lessonData);
} 