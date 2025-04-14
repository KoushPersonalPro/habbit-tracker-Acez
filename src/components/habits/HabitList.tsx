"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HabitCard from "./HabitCard";

interface Habit {
  id: string;
  name: string;
  description?: string;
  current_streak: number;
  longest_streak: number;
  growth_stage: number;
  last_completed_at?: string;
}

interface HabitListProps {
  habits: Habit[];
  onAddHabit: () => void;
  onCompleteHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onEditHabit: (id: string) => void;
}

export default function HabitList({
  habits = [],
  onAddHabit = () => {},
  onCompleteHabit = () => {},
  onDeleteHabit = () => {},
  onEditHabit = () => {},
}: HabitListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    // Add a small delay to allow the animation to complete
    setTimeout(() => {
      onDeleteHabit(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Habits</h2>
        <Button onClick={onAddHabit} className="gap-2">
          <Plus size={18} />
          <span>Add Habit</span>
        </Button>
      </div>

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-muted/50 rounded-lg p-8 text-center"
        >
          <h3 className="text-xl font-medium mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your habits to see your progress grow over time.
          </p>
          <Button onClick={onAddHabit} className="gap-2">
            <Plus size={18} />
            <span>Create Your First Habit</span>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                }}
                className={deletingId === habit.id ? "opacity-50" : ""}
              >
                <HabitCard
                  habit={habit}
                  onComplete={onCompleteHabit}
                  onDelete={handleDelete}
                  onEdit={onEditHabit}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
