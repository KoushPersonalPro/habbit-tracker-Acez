"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import HabitDetailCalendar from "@/components/habits/HabitDetailCalendar";

interface Habit {
  id: string;
  name: string;
  description?: string;
  current_streak: number;
  longest_streak: number;
  growth_stage: number;
  last_completed_at?: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  verification_type: string;
  verification_data?: string;
  verification_image_url?: string;
  note?: string;
}

export default function HabitDetailPage() {
  const params = useParams();
  const habitId = params.id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch habit details and logs
  useEffect(() => {
    const fetchHabitDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch habit details
        const habitResponse = await fetch(`/api/habits/${habitId}`);
        if (!habitResponse.ok) {
          throw new Error("Failed to fetch habit details");
        }
        const habitData = await habitResponse.json();
        setHabit(habitData);

        // Fetch habit logs
        const logsResponse = await fetch(`/api/habits/${habitId}/logs`);
        if (!logsResponse.ok) {
          throw new Error("Failed to fetch habit logs");
        }
        const logsData = await logsResponse.json();
        setLogs(logsData);
      } catch (err) {
        console.error("Error fetching habit details:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (habitId) {
      fetchHabitDetails();
    }
  }, [habitId]);

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          </div>
        ) : habit ? (
          <HabitDetailCalendar habit={habit} logs={logs} />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-muted p-4 rounded-md">Habit not found</div>
          </div>
        )}
      </main>
    </>
  );
}
