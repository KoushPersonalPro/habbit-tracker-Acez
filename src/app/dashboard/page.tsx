"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InfoIcon, UserCircle, Plus } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import DashboardNavbar from "@/components/dashboard-navbar";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import PhotoVerification from "@/components/verification/PhotoVerification";
import GrowthIndicator from "@/components/growth/GrowthIndicator";
import { Button } from "@/components/ui/button";

interface Habit {
  id: string;
  name: string;
  description?: string;
  current_streak: number;
  longest_streak: number;
  growth_stage: number;
  last_completed_at?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
      fetchHabits();
    };

    checkUser();
  }, []);

  // Fetch habits
  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/habits");
      if (!response.ok) throw new Error("Failed to fetch habits");
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new habit
  const createHabit = async (data: { name: string; description: string }) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create habit");
      const newHabit = await response.json();
      setHabits([newHabit, ...habits]);
      setShowHabitForm(false);
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  // Update a habit
  const updateHabit = async (data: {
    id?: string;
    name: string;
    description: string;
  }) => {
    if (!data.id) return;

    try {
      const response = await fetch(`/api/habits/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update habit");
      const updatedHabit = await response.json();

      setHabits(
        habits.map((habit) =>
          habit.id === updatedHabit.id ? updatedHabit : habit,
        ),
      );

      setEditingHabit(null);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  // Delete a habit
  const deleteHabit = async (id: string) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete habit");
      setHabits(habits.filter((habit) => habit.id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Complete a habit
  const completeHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setSelectedHabit(habit);
      setShowVerification(true);
    }
  };

  // Submit verification
  const submitVerification = async (
    imageUrl: string | null,
    note: string | null,
  ) => {
    if (!selectedHabit) return;

    try {
      const response = await fetch(`/api/habits/${selectedHabit.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationType: imageUrl ? "photo" : "note",
          verificationImageUrl: imageUrl,
          note: note,
        }),
      });

      if (!response.ok) throw new Error("Failed to verify habit");
      const updatedHabit = await response.json();

      // Update the habits list
      setHabits(
        habits.map((habit) =>
          habit.id === updatedHabit.id ? updatedHabit : habit,
        ),
      );

      setSelectedHabit(null);
      setShowVerification(false);
    } catch (error) {
      console.error("Error verifying habit:", error);
    }
  };

  // Edit a habit
  const editHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setEditingHabit(habit);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Habit Tracker</h1>
              <Button
                onClick={() => setShowHabitForm(true)}
                className="gap-2 md:self-end"
              >
                <Plus size={18} />
                <span>New Habit</span>
              </Button>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Track your daily habits and watch them grow into lasting
                routines
              </span>
            </div>
          </motion.header>

          {/* User Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-xl p-6 border shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <UserCircle size={64} className="text-primary" />
              <div className="text-center md:text-left">
                <h2 className="font-semibold text-xl">{user.email}</h2>
                <p className="text-sm text-muted-foreground">
                  Keep building those healthy habits!
                </p>
              </div>
            </div>
          </motion.section>

          {/* Habits Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <HabitList
                habits={habits}
                onAddHabit={() => setShowHabitForm(true)}
                onCompleteHabit={completeHabit}
                onDeleteHabit={deleteHabit}
                onEditHabit={editHabit}
              />
            )}
          </motion.section>
        </div>
      </main>

      {/* Habit Form Dialog */}
      {showHabitForm && (
        <HabitForm
          open={showHabitForm}
          onClose={() => setShowHabitForm(false)}
          onSubmit={createHabit}
        />
      )}

      {/* Edit Habit Dialog */}
      {editingHabit && (
        <HabitForm
          open={!!editingHabit}
          onClose={() => setEditingHabit(null)}
          onSubmit={updateHabit}
          initialData={{
            id: editingHabit.id,
            name: editingHabit.name,
            description: editingHabit.description || "",
          }}
          isEditing
        />
      )}

      {/* Verification Dialog */}
      {selectedHabit && showVerification && (
        <PhotoVerification
          open={showVerification}
          onClose={() => {
            setShowVerification(false);
            setSelectedHabit(null);
          }}
          onSubmit={submitVerification}
          habitName={selectedHabit.name}
        />
      )}
    </>
  );
}
