"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Award,
  Camera,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getGrowthStageData } from "@/utils/growth";
import { isCompletedToday } from "@/utils/streak";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    current_streak: number;
    longest_streak: number;
    growth_stage: number;
    last_completed_at?: string;
  };
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function HabitCard({
  habit,
  onComplete = () => {},
  onDelete = () => {},
  onEdit = () => {},
}: HabitCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const growthStage = getGrowthStageData(habit.current_streak);
  const completedToday = isCompletedToday(habit.last_completed_at || null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 h-full flex flex-col bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold truncate">
              {habit.name}
            </CardTitle>
            <div className="flex gap-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(habit.id)}
                  className="h-8 w-8"
                >
                  <Edit size={16} style={{color:"grey"}}/>
                </Button>
              </motion.div>.
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(habit.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>.
            </div>
          </div>
          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full"
              style={{ backgroundColor: `${growthStage.color}20` }}
            >
              <span className="text-2xl">{growthStage.icon}</span>
            </div>
            <div>
              <p className="font-medium">{growthStage.name}</p>
              <p className="text-xs text-muted-foreground">
                {growthStage.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <span className="text-sm">
                Streak: {habit.current_streak} days
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span className="text-sm">Best: {habit.longest_streak} days</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            onClick={() => onComplete(habit.id)}
            className="w-full gap-2"
            variant={completedToday ? "secondary" : "default"}
            disabled={completedToday}
          >
            {completedToday ? (
              <>
                <CheckCircle size={18} />
                <span>Completed Today</span>
              </>
            ) : (
              <>
                <Camera size={18} />
                <span>Complete Today</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
