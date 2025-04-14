/**
 * Streak tracking utility functions
 */

/**
 * Check if a habit was completed today
 * @param lastCompletedAt - The timestamp of the last completion
 */
export function isCompletedToday(lastCompletedAt: string | null): boolean {
  if (!lastCompletedAt) return false;

  const lastDate = new Date(lastCompletedAt);
  const today = new Date();

  return (
    lastDate.getDate() === today.getDate() &&
    lastDate.getMonth() === today.getMonth() &&
    lastDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a habit was completed yesterday
 * @param lastCompletedAt - The timestamp of the last completion
 */
export function isCompletedYesterday(lastCompletedAt: string | null): boolean {
  if (!lastCompletedAt) return false;

  const lastDate = new Date(lastCompletedAt);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    lastDate.getDate() === yesterday.getDate() &&
    lastDate.getMonth() === yesterday.getMonth() &&
    lastDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if the streak is broken (not completed yesterday or today)
 * @param lastCompletedAt - The timestamp of the last completion
 */
export function isStreakBroken(lastCompletedAt: string | null): boolean {
  if (!lastCompletedAt) return false;
  if (
    isCompletedToday(lastCompletedAt) ||
    isCompletedYesterday(lastCompletedAt)
  ) {
    return false;
  }
  return true;
}

/**
 * Calculate the growth stage based on streak count
 * @param streak - Current streak count
 */
export function calculateGrowthStage(streak: number): number {
  if (streak < 3) return 0; // Seed
  if (streak < 7) return 1; // Seedling
  if (streak < 14) return 2; // Plant
  if (streak < 30) return 3; // Growing plant
  return 4; // Tree (30+ days)
}

/**
 * Get the name of the growth stage
 * @param stage - Growth stage number (0-4)
 */
export function getGrowthStageName(stage: number): string {
  const stages = ["Seed", "Seedling", "Plant", "Growing Plant", "Tree"];
  return stages[Math.min(stage, 4)];
}
