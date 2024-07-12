import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { topic: string; module_number: string } },
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const { data: moduleData, error: moduleError } = await supabase
    .from("modules")
    .select("*")
    .eq("module_number", params.module_number)
    .eq("topic", params.topic)
    .single();
  console.log("moddata", moduleData);

  if (moduleError) {
    return NextResponse.json(
      { error: "Error fetching module data" },
      { status: 500 },
    );
  }

  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_number", params.module_number)
    .eq("topic", params.topic)
    .order("lesson_number");

  if (lessonsError) {
    return NextResponse.json(
      { error: "Error fetching lessons data" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    module: moduleData,
    lessons: lessonsData,
  });
}
