import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/helpers";
import { QuickActions } from "../quick-actions";

describe("QuickActions", () => {
  it('renders "Generate Meal Plan" action', () => {
    renderWithProviders(<QuickActions />);

    expect(screen.getByText("Generate Meal Plan")).toBeInTheDocument();
  });

  it('renders "Browse Recipes" action', () => {
    renderWithProviders(<QuickActions />);

    expect(screen.getByText("Browse Recipes")).toBeInTheDocument();
  });

  it('renders "AI Chef Assistant" action', () => {
    renderWithProviders(<QuickActions />);

    expect(screen.getByText("AI Chef Assistant")).toBeInTheDocument();
  });

  it("action links navigate correctly", () => {
    renderWithProviders(<QuickActions />);

    expect(
      screen.getByText("Generate Meal Plan").closest("a")
    ).toHaveAttribute("href", "/meal-plans?generate=true");

    expect(
      screen.getByText("Browse Recipes").closest("a")
    ).toHaveAttribute("href", "/recipes");

    expect(
      screen.getByText("AI Chef Assistant").closest("a")
    ).toHaveAttribute("href", "/chat");
  });
});
