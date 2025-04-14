import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { isStreakBroken, calculateGrowthStage } from "@/utils/streak";

// GET /api/habits - Get all habits for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all habits for the user
    const { data: habits, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching habits:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the latest log for each habit
    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const { data: logs } = await supabase
          .from("habit_logs")
          .select("*")
          .eq("habit_id", habit.id)
          .order("completed_at", { ascending: false })
          .limit(1);

        const lastLog = logs?.[0];

        // Check if streak is broken and update if needed
        if (lastLog && isStreakBroken(lastLog.completed_at)) {
          // Reset streak
          const { data: updatedHabit } = await supabase
            .from("habits")
            .update({
              current_streak: 0,
              growth_stage: 0,
            })
            .eq("id", habit.id)
            .select()
            .single();

          return {
            ...updatedHabit,
            last_completed_at: lastLog.completed_at,
          };
        }

        return {
          ...habit,
          last_completed_at: lastLog?.completed_at,
        };
      }),
    );

    return NextResponse.json(habitsWithLogs);
  } catch (error) {
    console.error("Error in GET /api/habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 },
      );
    }

    // Create the habit
    const { data: habit, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name,
        description,
        current_streak: 0,
        longest_streak: 0,
        growth_stage: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating habit:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/habits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
