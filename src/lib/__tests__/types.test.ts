import type {
  User,
  Recipe,
  MealPlan,
  InventoryItem,
  ShoppingItem,
  ChatSession,
  Subscription,
  MealSlot,
} from "../types";
import { factories } from "@/__tests__/helpers";

describe("Type factories", () => {
  it("creates a valid User", () => {
    const user: User = factories.user();
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.household_size).toBeGreaterThan(0);
    expect(Array.isArray(user.dietary_restrictions)).toBe(true);
    expect(Array.isArray(user.allergies)).toBe(true);
    expect(Array.isArray(user.health_goals)).toBe(true);
    expect(user.cooking_skill).toBeDefined();
    expect(user.tier).toBeDefined();
    expect(user.created_at).toBeDefined();
  });

  it("creates a valid Recipe", () => {
    const recipe: Recipe = factories.recipeDetail();
    expect(recipe.id).toBeDefined();
    expect(recipe.title).toBeDefined();
    expect(recipe.cuisine).toBeDefined();
    expect(["easy", "medium", "hard"]).toContain(recipe.difficulty);
    expect(recipe.prep_time).toBeGreaterThanOrEqual(0);
    expect(recipe.cook_time).toBeGreaterThanOrEqual(0);
    expect(recipe.servings).toBeGreaterThan(0);
    expect(recipe.ingredients).toBeDefined();
    expect(recipe.steps).toBeDefined();
    expect(recipe.nutrition).toBeDefined();
  });

  it("creates a valid MealPlan", () => {
    const plan: MealPlan = factories.mealPlan();
    expect(plan.id).toBeDefined();
    expect(plan.week_start).toBeDefined();
    expect(Array.isArray(plan.slots)).toBe(true);
    expect(plan.slots.length).toBeGreaterThan(0);
  });

  it("creates a valid MealSlot", () => {
    const slot: MealSlot = factories.mealSlot();
    expect(slot.id).toBeDefined();
    expect(slot.day).toBeDefined();
    expect(["breakfast", "lunch", "dinner", "snack"]).toContain(slot.meal_type);
    expect(slot.recipe_id).toBeDefined();
    expect(slot.recipe_title).toBeDefined();
    expect(slot.servings).toBeGreaterThan(0);
    expect(typeof slot.is_flex).toBe("boolean");
    expect(typeof slot.is_completed).toBe("boolean");
  });

  it("creates a valid InventoryItem", () => {
    const item: InventoryItem = factories.inventoryItem();
    expect(item.id).toBeDefined();
    expect(item.ingredient_id).toBeDefined();
    expect(item.name).toBeDefined();
    expect(item.quantity).toBeGreaterThan(0);
    expect(item.unit).toBeDefined();
    expect(["fridge", "freezer", "pantry", "other"]).toContain(item.location);
    expect(typeof item.is_expiring_soon).toBe("boolean");
    expect(item.added_at).toBeDefined();
  });

  it("creates a valid ShoppingItem", () => {
    const item: ShoppingItem = factories.shoppingItem();
    expect(item.id).toBeDefined();
    expect(item.ingredient_id).toBeDefined();
    expect(item.name).toBeDefined();
    expect(item.quantity).toBeGreaterThan(0);
    expect(item.unit).toBeDefined();
    expect(typeof item.is_checked).toBe("boolean");
    expect(item.category).toBeDefined();
    expect(item.added_at).toBeDefined();
  });

  it("creates a valid ChatSession", () => {
    const session: ChatSession = factories.chatSession();
    expect(session.id).toBeDefined();
    expect(session.created_at).toBeDefined();
    expect(session.updated_at).toBeDefined();
  });

  it("creates a valid Subscription", () => {
    const sub: Subscription = factories.subscription();
    expect(sub.tier).toBeDefined();
    expect(["free", "pro", "family"]).toContain(sub.tier);
    expect(sub.status).toBeDefined();
    expect(["active", "cancelled", "past_due", "trialing"]).toContain(sub.status);
    expect(typeof sub.cancel_at_period_end).toBe("boolean");
  });

  it("factory overrides work correctly", () => {
    const user: User = factories.user({ name: "Custom Name", tier: "pro" });
    expect(user.name).toBe("Custom Name");
    expect(user.tier).toBe("pro");
  });
});
