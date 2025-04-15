import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../supabase/server";

// GET /api/habits/[id]/logs - Get logs for a specific habit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the habit belongs to the user
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (habitError || !habit) {
      return NextResponse.json(
        { error: "Habit not found or unauthorized" },
        { status: 404 },
      );
    }

    // Get all logs for the habit
    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", params.id)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (logsError) {
      console.error("Error fetching habit logs:", logsError);
      return NextResponse.json({ error: logsError.message }, { status: 500 });
    }

    return NextResponse.json(logs);
  } catch (error) {
    console.error(`Error in GET /api/habits/${params.id}/logs:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
