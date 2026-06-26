// ── Auth ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface OnboardingRequest {
  household_size: number;
  dietary_restrictions: string[];
  allergies: string[];
  health_goals: string[];
  cooking_skill: "beginner" | "intermediate" | "advanced";
}

// ── User ──
export interface User {
  id: string;
  email: string;
  name: string;
  household_size: number;
  dietary_restrictions: string[];
  allergies: string[];
  health_goals: string[];
  cooking_skill: string;
  tier: "free" | "pro" | "family";
  created_at: string;
}

export interface UserPreferences {
  cuisine_weights: Record<string, number>;
  difficulty_weights: Record<string, number>;
  ingredient_weights: Record<string, number>;
}

// ── Recipe ──
export interface RecipeListItem {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prep_time: number;
  cook_time: number;
  servings: number;
  calories: number;
  is_favourite: boolean;
  rating_avg: number;
  rating_count: number;
  image_url: string | null;
}

export interface RecipeIngredient {
  ingredient_id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe extends RecipeListItem {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: RecipeNutrition;
  images: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface RecipeSearchParams {
  q?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  max_time?: number;
  dietary?: string;
  limit?: number;
  offset?: number;
  page?: number;
  per_page?: number;
}

// ── Meal Plan ──
export interface MealPlanListItem {
  id: string;
  week_start: string;
  created_at: string;
  slot_count: number;
}

export interface MealSlot {
  id: string;
  day: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  recipe_id: string;
  recipe_title: string;
  servings: number;
  is_flex: boolean;
  flex_type: "effort" | "nutrition" | "mental" | "social" | null;
  is_completed: boolean;
}

export interface MealPlan {
  id: string;
  week_start: string;
  slots: MealSlot[];
}

export interface GenerateMealPlanRequest {
  week_start: string;
  preferences?: {
    max_prep_time?: number;
    cuisines?: string[];
    avoid_repeated?: boolean;
  };
}

export interface MealPlanNutrition {
  days: {
    day: number;
    day_name: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    meals: {
      meal_type: string;
      calories: number;
      protein: number;
    }[];
  }[];
  week_totals: {
    avg_daily_calories: number;
    avg_daily_protein: number;
  };
}

// ── Inventory ──
export interface InventoryItem {
  id: string;
  ingredient_id: number;
  name: string;
  quantity: number;
  unit: string;
  location: "fridge" | "freezer" | "pantry" | "other";
  expiry_date: string | null;
  is_expiring_soon: boolean;
  added_at: string;
}

export interface AddInventoryRequest {
  ingredient_id: number;
  quantity: number;
  unit: string;
  location: "fridge" | "freezer" | "pantry" | "other";
  expiry_date?: string;
}

export interface InventoryResponse {
  items: InventoryItem[];
  expiring_count: number;
}

// ── Shopping List ──
export interface ShoppingItem {
  id: string;
  ingredient_id: number;
  name: string;
  quantity: number;
  unit: string;
  is_checked: boolean;
  category: string;
  added_at: string;
}

export interface ShoppingListResponse {
  items: ShoppingItem[];
  total_items: number;
  checked_items: number;
}

// ── Chat ──
export interface ChatSession {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  session_id?: number;
  recipe_id?: number;
}

export interface ChatResponse {
  session_id: number;
  message_id: number;
  reply: string;
  tokens_used: number;
  actions_taken: string[];
}

// ── Subscription ──
export interface Subscription {
  tier: "free" | "pro" | "family";
  status: "active" | "cancelled" | "past_due" | "trialing";
  stripe_subscription_id: string | null;
  valid_until: string | null;
  cancel_at_period_end: boolean;
  is_self_hosted?: boolean;
}

export interface CheckoutRequest {
  tier: "pro" | "family";
  success_url: string;
  cancel_url: string;
}

export interface CheckoutResponse {
  checkout_url: string;
}

// ── Ingredient Search ──
export interface Ingredient {
  id: number;
  name: string;
  category?: string;
}

// ── Household / Family ──
export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "member";
}

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  members: HouseholdMember[];
}

// ── Nutrition / What to buy ──
export interface WhatToBuyItem {
  item: string;
  reason: string;
  nutrient: string | null;
  amount: number | null;
  unit: string | null;
}

// ── Stores ──
export interface NearbyStore {
  id: string | null;
  name: string;
  brand: string | null;
  lat: number;
  lng: number;
  distance_km: number;
  is_curated: boolean;
  has_promotions: boolean;
}
