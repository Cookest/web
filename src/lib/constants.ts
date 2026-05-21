export const CUISINES = [
  "italian",
  "asian",
  "mediterranean",
  "mexican",
  "french",
  "indian",
  "american",
  "japanese",
] as const;

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
] as const;

export const DIETARY_OPTIONS_FULL = [
  ...DIETARY_OPTIONS,
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
] as const;

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

export const HEALTH_GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "heart_health", label: "Heart Health" },
  { value: "energy", label: "More Energy" },
  { value: "balanced", label: "Balanced Diet" },
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;
