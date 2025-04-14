"use client";

import { motion } from "framer-motion";
import {
  getGrowthStageData,
  calculateProgressToNextStage,
  GROWTH_STAGES,
} from "@/utils/growth";

interface GrowthIndicatorProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export default function GrowthIndicator({
  streak = 0,
  size = "md",
  showDetails = false,
}: GrowthIndicatorProps) {
  const currentStage = getGrowthStageData(streak);
  const progress = calculateProgressToNextStage(streak);
  const isMaxStage =
    currentStage.name === GROWTH_STAGES[GROWTH_STAGES.length - 1].name;

  // Size mappings
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center mb-2`}
      >
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress arc */}
          {!isMaxStage && (
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke={currentStage.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.89} 1000`} // 289.02652413 is approx circumference of circle with r=46
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: `${progress * 2.89} 1000` }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          )}
          {/* Full circle for max stage */}
          {isMaxStage && (
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke={currentStage.color}
              strokeWidth="8"
              initial={{ strokeDasharray: "0 1000" }}
              animate={{ strokeDasharray: "289.02652413 0" }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
          )}
        </svg>

        {/* Plant icon */}
        <motion.span
          className={`${iconSizes[size]} z-10`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {currentStage.icon}
        </motion.span>
      </div>

      {showDetails && (
        <div className="text-center">
          <motion.h3
            className="font-medium text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {currentStage.name}
          </motion.h3>
          <motion.p
            className="text-xs text-muted-foreground mt-1 max-w-[200px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isMaxStage
              ? currentStage.description
              : `${currentStage.description} ${GROWTH_STAGES[GROWTH_STAGES.findIndex((s) => s.name === currentStage.name) + 1]?.minStreak - streak} more days to next stage.`}
          </motion.p>
        </div>
      )}
    </div>
  );
}
