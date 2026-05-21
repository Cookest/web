import { client, ApiError } from "./client";
import * as authApi from "./auth";
import * as recipesApi from "./recipes";
import * as mealsApi from "./meals";
import * as inventoryApi from "./inventory";
import * as shoppingApi from "./shopping";
import * as chatApi from "./chat";
import * as profileApi from "./profile";
import * as subscriptionApi from "./subscription";
import * as ingredientsApi from "./ingredients";

export const api = {
  setToken: client.setToken.bind(client),
  getToken: client.getToken.bind(client),
  ...authApi,
  ...recipesApi,
  ...mealsApi,
  ...inventoryApi,
  ...shoppingApi,
  ...chatApi,
  ...profileApi,
  ...subscriptionApi,
  ...ingredientsApi,
};

export { ApiError } from "./client";
export { client } from "./client";
