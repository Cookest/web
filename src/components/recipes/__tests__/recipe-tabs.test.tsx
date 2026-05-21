import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, factories } from "@/__tests__/helpers";
import { RecipeTabs } from "../recipe-tabs";

const recipe = factories.recipeDetail();
const defaultProps = {
  recipe,
  activeTab: "ingredients" as const,
  onTabChange: vi.fn(),
  checkedIngredients: new Set<number>(),
  onToggleIngredient: vi.fn(),
};

describe("RecipeTabs", () => {
  it("renders ingredients tab by default", () => {
    renderWithProviders(<RecipeTabs {...defaultProps} />);

    expect(screen.getByText("Spaghetti")).toBeInTheDocument();
    expect(screen.getByText("Eggs")).toBeInTheDocument();
    expect(screen.getByText("Pancetta")).toBeInTheDocument();
  });

  it("shows ingredient names and quantities", () => {
    renderWithProviders(<RecipeTabs {...defaultProps} />);

    expect(screen.getByText("400 g")).toBeInTheDocument();
    expect(screen.getByText("4 pieces")).toBeInTheDocument();
    expect(screen.getByText("200 g")).toBeInTheDocument();
  });

  it("switches to instructions tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeTabs {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /instructions/i }));

    expect(defaultProps.onTabChange).toHaveBeenCalledWith("instructions");
  });

  it("shows step numbers and instructions", () => {
    renderWithProviders(
      <RecipeTabs {...defaultProps} activeTab="instructions" />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(
      screen.getByText("Boil salted water and cook spaghetti.")
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(
      screen.getByText("Fry pancetta until crispy.")
    ).toBeInTheDocument();
  });

  it("switches to nutrition tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeTabs {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /nutrition/i }));

    expect(defaultProps.onTabChange).toHaveBeenCalledWith("nutrition");
  });

  it("shows calorie and macro values", () => {
    renderWithProviders(
      <RecipeTabs {...defaultProps} activeTab="nutrition" />
    );

    expect(screen.getByText("Calories")).toBeInTheDocument();
    expect(screen.getByText("520 kcal")).toBeInTheDocument();
    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByText("22g")).toBeInTheDocument();
    expect(screen.getByText("Carbs")).toBeInTheDocument();
    expect(screen.getByText("68g")).toBeInTheDocument();
    expect(screen.getByText("Fat")).toBeInTheDocument();
    expect(screen.getByText("18g")).toBeInTheDocument();
  });
});
