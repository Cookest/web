import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactElement, type ReactNode } from "react";

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

// Wrapper with providers
function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

// Mock API response helper
export function mockFetchResponse(data: unknown, status = 200) {
  return (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

export function mockFetchError(status: number, body = "Error") {
  return (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve({ error: body }),
    text: () => Promise.resolve(body),
  });
}

// ── Test data factories ──

export const factories = {
  user: (overrides = {}) => ({
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    household_size: 2,
    dietary_restrictions: [],
    allergies: [],
    health_goals: [],
    cooking_skill: "intermediate",
    tier: "free" as const,
    created_at: "2024-01-15T10:00:00Z",
    ...overrides,
  }),

  recipe: (overrides = {}) => ({
    id: "recipe-1",
    title: "Pasta Carbonara",
    description: "Classic Roman pasta dish",
    cuisine: "italian",
    difficulty: "medium" as const,
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    calories: 520,
    is_favourite: false,
    rating_avg: 4.3,
    rating_count: 12,
    image_url: null,
    ...overrides,
  }),

  recipeDetail: (overrides = {}) => ({
    ...factories.recipe(overrides),
    ingredients: [
      { ingredient_id: 1, name: "Spaghetti", quantity: 400, unit: "g" },
      { ingredient_id: 2, name: "Eggs", quantity: 4, unit: "pieces" },
      { ingredient_id: 3, name: "Pancetta", quantity: 200, unit: "g" },
    ],
    steps: [
      { step_number: 1, instruction: "Boil salted water and cook spaghetti." },
      { step_number: 2, instruction: "Fry pancetta until crispy." },
      { step_number: 3, instruction: "Mix eggs with cheese." },
    ],
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 68,
      fat: 18,
      fiber: 3,
    },
    images: [],
  }),

  mealSlot: (overrides = {}) => ({
    id: "slot-1",
    day: 0,
    meal_type: "breakfast" as const,
    recipe_id: "recipe-1",
    recipe_title: "Oat Porridge",
    servings: 2,
    is_flex: false,
    flex_type: null,
    is_completed: false,
    ...overrides,
  }),

  mealPlan: (overrides = {}) => ({
    id: "plan-1",
    week_start: "2024-01-15",
    slots: [
      factories.mealSlot(),
      factories.mealSlot({
        id: "slot-2",
        meal_type: "lunch",
        recipe_title: "Caesar Salad",
      }),
      factories.mealSlot({
        id: "slot-3",
        meal_type: "dinner",
        recipe_title: "Grilled Salmon",
      }),
    ],
    ...overrides,
  }),

  inventoryItem: (overrides = {}) => ({
    id: "inv-1",
    ingredient_id: 1,
    name: "Chicken Breast",
    quantity: 500,
    unit: "g",
    location: "fridge" as const,
    expiry_date: "2024-01-22",
    is_expiring_soon: true,
    added_at: "2024-01-18T09:00:00Z",
    ...overrides,
  }),

  shoppingItem: (overrides = {}) => ({
    id: "shop-1",
    ingredient_id: 1,
    name: "Chicken Breast",
    quantity: 600,
    unit: "g",
    is_checked: false,
    category: "meat",
    added_at: "2024-01-20T10:00:00Z",
    ...overrides,
  }),

  chatSession: (overrides = {}) => ({
    id: 1,
    title: "Chicken pasta ideas",
    created_at: "2024-01-20T15:28:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    ...overrides,
  }),

  chatMessage: (overrides = {}) => ({
    id: 1,
    role: "user" as const,
    content: "What can I make with chicken?",
    created_at: "2024-01-20T15:28:00Z",
    ...overrides,
  }),

  subscription: (overrides = {}) => ({
    tier: "free" as const,
    status: "active" as const,
    stripe_subscription_id: null,
    valid_until: null,
    cancel_at_period_end: false,
    ...overrides,
  }),
};
