import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../supabase/server";
import { isCompletedToday, calculateGrowthStage } from "@/utils/streak";

// POST /api/habits/[id]/verify - Verify a habit completion
export async function POST(
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

    // Get the request body
    const body = await request.json();
    const { verificationType, verificationData, verificationImageUrl, note } =
      body;

    if (!verificationType) {
      return NextResponse.json(
        { error: "Verification type is required" },
        { status: 400 },
      );
    }

    // Check if already completed today
    const { data: latestLog } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", params.id)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1);

    if (
      latestLog &&
      latestLog.length > 0 &&
      isCompletedToday(latestLog[0].completed_at)
    ) {
      return NextResponse.json(
        { error: "Habit already completed today" },
        { status: 400 },
      );
    }

    // Get the current habit
    const { data: habit } = await supabase
      .from("habits")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Create the log
    const { data: log, error: logError } = await supabase
      .from("habit_logs")
      .insert({
        habit_id: params.id,
        user_id: user.id,
        verification_type: verificationType,
        verification_data: verificationData,
        verification_image_url: verificationImageUrl,
        note: note,
      })
      .select()
      .single();

    if (logError) {
      console.error("Error creating log:", logError);
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    // Update the habit streak
    const newStreak = habit.current_streak + 1;
    const longestStreak = Math.max(habit.longest_streak, newStreak);
    const growthStage = calculateGrowthStage(newStreak);

    const { data: updatedHabit, error: habitError } = await supabase
      .from("habits")
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        growth_stage: growthStage,
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (habitError) {
      console.error("Error updating habit:", habitError);
      return NextResponse.json({ error: habitError.message }, { status: 500 });
    }

    return NextResponse.json({
      ...updatedHabit,
      last_completed_at: log.completed_at,
      streakIncreased: true,
      previousGrowthStage: habit.growth_stage,
      newGrowthStage: growthStage,
    });
  } catch (error) {
    console.error(`Error in POST /api/habits/${params.id}/verify:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
