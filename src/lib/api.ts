import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OnboardingRequest,
  User,
  UserPreferences,
  Recipe,
  RecipeListItem,
  RecipeSearchParams,
  PaginatedResponse,
  MealPlan,
  MealPlanListItem,
  GenerateMealPlanRequest,
  MealPlanNutrition,
  InventoryItem,
  InventoryResponse,
  AddInventoryRequest,
  ShoppingItem,
  ShoppingListResponse,
  ChatSession,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  Subscription,
  CheckoutRequest,
  CheckoutResponse,
  Ingredient,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  }

  getToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include", // for httpOnly refresh cookie
    });

    if (res.status === 401) {
      // Try to refresh the token
      const refreshed = await this.refresh();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        const retryRes = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
          credentials: "include",
        });
        if (!retryRes.ok) {
          throw new ApiError(retryRes.status, await retryRes.text());
        }
        if (retryRes.status === 204) return undefined as T;
        return retryRes.json();
      }
      // Refresh failed — redirect to login
      if (typeof window !== "undefined") {
        this.setToken(null);
        window.location.href = "/login";
      }
      throw new ApiError(401, "Session expired");
    }

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // ── Auth ──

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async register(data: RegisterRequest): Promise<{ id: string; email: string; name: string }> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refresh(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data: AuthResponse = await res.json();
      this.setToken(data.access_token);
      return true;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", { method: "POST" });
    this.setToken(null);
  }

  async onboarding(data: OnboardingRequest): Promise<User> {
    return this.request("/api/auth/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ── Profile ──

  async getProfile(): Promise<User> {
    return this.request("/api/me");
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request("/api/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(): Promise<void> {
    return this.request("/api/me", { method: "DELETE" });
  }

  async changePassword(current_password: string, new_password: string): Promise<void> {
    return this.request("/api/me/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    });
  }

  async getPreferences(): Promise<UserPreferences> {
    return this.request("/api/me/preferences");
  }

  async resetPreferences(): Promise<void> {
    return this.request("/api/me/preferences", { method: "DELETE" });
  }

  async getFavourites(limit = 20, offset = 0): Promise<PaginatedResponse<RecipeListItem>> {
    return this.request(`/api/me/favourites?limit=${limit}&offset=${offset}`);
  }

  async getHistory(limit = 20, offset = 0): Promise<PaginatedResponse<{ recipe_id: string; title: string; cooked_at: string; servings: number }>> {
    return this.request(`/api/me/history?limit=${limit}&offset=${offset}`);
  }

  // ── Recipes ──

  async searchRecipes(params: RecipeSearchParams = {}): Promise<PaginatedResponse<RecipeListItem>> {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.difficulty) query.set("difficulty", params.difficulty);
    if (params.max_time) query.set("max_time", params.max_time.toString());
    if (params.dietary) query.set("dietary", params.dietary);
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.offset) query.set("offset", params.offset.toString());
    return this.request(`/api/recipes?${query.toString()}`);
  }

  async getRecipe(id: string): Promise<Recipe> {
    return this.request(`/api/recipes/${encodeURIComponent(id)}`);
  }

  async toggleFavourite(id: string): Promise<{ is_favourite: boolean }> {
    return this.request(`/api/recipes/${encodeURIComponent(id)}/favourite`, {
      method: "POST",
    });
  }

  async rateRecipe(id: string, rating: number, notes?: string): Promise<void> {
    return this.request(`/api/recipes/${encodeURIComponent(id)}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating, notes }),
    });
  }

  async cookRecipe(id: string, servings: number): Promise<{ cooked_at: string; inventory_updated: boolean; ingredients_deducted: number }> {
    return this.request(`/api/recipes/${encodeURIComponent(id)}/cook`, {
      method: "POST",
      body: JSON.stringify({ servings }),
    });
  }

  async generateRecipe(prompt: string, use_pantry = false, cuisine_hint?: string, max_minutes?: number): Promise<Recipe> {
    return this.request("/api/recipes/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, use_pantry, cuisine_hint, max_minutes }),
    });
  }

  // ── Meal Plans ──

  async getMealPlans(): Promise<MealPlanListItem[]> {
    return this.request("/api/meal-plans");
  }

  async getMealPlan(id: string): Promise<MealPlan> {
    return this.request(`/api/meal-plans/${encodeURIComponent(id)}`);
  }

  async getCurrentMealPlan(): Promise<MealPlan> {
    return this.request("/api/meal-plans/current");
  }

  async generateMealPlan(data: GenerateMealPlanRequest): Promise<MealPlan> {
    return this.request("/api/meal-plans/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteMealPlan(id: string): Promise<void> {
    return this.request(`/api/meal-plans/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  async updateMealSlot(planId: string, slotId: string, data: Partial<{ recipe_id: string; servings: number; is_flex: boolean; flex_type: string; is_completed: boolean }>): Promise<void> {
    return this.request(`/api/meal-plans/${encodeURIComponent(planId)}/slots/${encodeURIComponent(slotId)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getMealPlanNutrition(id: string): Promise<MealPlanNutrition> {
    return this.request(`/api/meal-plans/${encodeURIComponent(id)}/nutrition`);
  }

  // ── Inventory ──

  async getInventory(expiring_soon?: boolean, location?: string): Promise<InventoryResponse> {
    const query = new URLSearchParams();
    if (expiring_soon) query.set("expiring_soon", "true");
    if (location) query.set("location", location);
    const qs = query.toString();
    return this.request(`/api/inventory${qs ? `?${qs}` : ""}`);
  }

  async addInventoryItem(data: AddInventoryRequest): Promise<InventoryItem> {
    return this.request("/api/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateInventoryItem(id: string, data: Partial<AddInventoryRequest>): Promise<InventoryItem> {
    return this.request(`/api/inventory/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteInventoryItem(id: string): Promise<void> {
    return this.request(`/api/inventory/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  // ── Shopping List ──

  async getShoppingList(): Promise<ShoppingListResponse> {
    return this.request("/api/shopping-list");
  }

  async addShoppingItem(data: { ingredient_id: number; quantity: number; unit: string }): Promise<ShoppingItem> {
    return this.request("/api/shopping-list/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async toggleShoppingItem(id: string): Promise<void> {
    return this.request(`/api/shopping-list/items/${encodeURIComponent(id)}/check`, {
      method: "PATCH",
    });
  }

  async deleteShoppingItem(id: string): Promise<void> {
    return this.request(`/api/shopping-list/items/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  async clearCheckedItems(): Promise<void> {
    return this.request("/api/shopping-list/clear-checked", {
      method: "DELETE",
    });
  }

  async syncShoppingList(): Promise<void> {
    return this.request("/api/shopping-list/sync", { method: "POST" });
  }

  // ── Chat ──

  async sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
    return this.request("/api/chat", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return this.request("/api/chat/sessions");
  }

  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return this.request(`/api/chat/sessions/${sessionId}/messages`);
  }

  async deleteChatSession(sessionId: number): Promise<void> {
    return this.request(`/api/chat/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }

  // ── Subscription ──

  async getSubscription(): Promise<Subscription> {
    return this.request("/api/subscription");
  }

  async createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return this.request("/api/subscription/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createPortalSession(return_url: string): Promise<{ portal_url: string }> {
    return this.request("/api/subscription/portal", {
      method: "POST",
      body: JSON.stringify({ return_url }),
    });
  }

  // ── Ingredients ──

  async searchIngredients(q: string): Promise<Ingredient[]> {
    return this.request(`/api/ingredients?q=${encodeURIComponent(q)}`);
  }
}

export class ApiError extends Error {
  constructor(public status: number, public body: string) {
    super(`API Error ${status}: ${body}`);
  }
}

export const api = new ApiClient();
