/**
 * Visual growth stage utility functions
 */

// Define the growth stages
export const GROWTH_STAGES = [
  {
    name: "Seed",
    description: "Just getting started! Keep going to see growth.",
    minStreak: 0,
    color: "#8B4513", // Brown
    icon: "🌱",
  },
  {
    name: "Seedling",
    description: "Your habit is starting to take root!",
    minStreak: 3,
    color: "#90EE90", // Light green
    icon: "🌿",
  },
  {
    name: "Plant",
    description: "Growing steadily! You're building consistency.",
    minStreak: 7,
    color: "#32CD32", // Lime green
    icon: "🪴",
  },
  {
    name: "Growing Plant",
    description: "Your habit is flourishing! Keep nurturing it.",
    minStreak: 14,
    color: "#228B22", // Forest green
    icon: "🌳",
  },
  {
    name: "Tree",
    description: "Congratulations! Your habit is fully established.",
    minStreak: 30,
    color: "#006400", // Dark green
    icon: "🌲",
  },
];

/**
 * Get growth stage data based on streak count
 * @param streak - Current streak count
 */
export function getGrowthStageData(streak: number) {
  for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
    if (streak >= GROWTH_STAGES[i].minStreak) {
      return GROWTH_STAGES[i];
    }
  }
  return GROWTH_STAGES[0]; // Default to seed
}

/**
 * Calculate progress percentage to next stage
 * @param streak - Current streak count
 */
export function calculateProgressToNextStage(streak: number): number {
  const currentStage = getGrowthStageData(streak);
  const currentIndex = GROWTH_STAGES.findIndex(
    (stage) => stage.name === currentStage.name,
  );

  // If at max stage, return 100%
  if (currentIndex === GROWTH_STAGES.length - 1) {
    return 100;
  }

  const nextStage = GROWTH_STAGES[currentIndex + 1];
  const rangeSize = nextStage.minStreak - currentStage.minStreak;
  const progress = streak - currentStage.minStreak;

  return Math.min(Math.floor((progress / rangeSize) * 100), 100);
}
