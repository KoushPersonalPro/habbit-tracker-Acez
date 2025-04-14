import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";
import { calculateGrowthStage } from "@/utils/streak";

// GET /api/habits/[id] - Get a specific habit
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

    // Get the habit
    const { data: habit, error } = await supabase
      .from("habits")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching habit:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the latest log
    const { data: logs } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("habit_id", habit.id)
      .order("completed_at", { ascending: false })
      .limit(1);

    return NextResponse.json({
      ...habit,
      last_completed_at: logs?.[0]?.completed_at,
    });
  } catch (error) {
    console.error(`Error in GET /api/habits/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 },
      );
    }

    // Update the habit
    const { data: habit, error } = await supabase
      .from("habits")
      .update({ name, description })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating habit:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error(`Error in PUT /api/habits/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
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

    // Delete the habit
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting habit:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/habits/${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
