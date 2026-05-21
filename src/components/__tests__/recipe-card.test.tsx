import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { RecipeCard } from "@/components/recipe-card";
import { renderWithProviders, factories } from "@/__tests__/helpers";

describe("RecipeCard", () => {
  it("renders recipe title", () => {
    const recipe = factories.recipe({ title: "Spaghetti Bolognese" });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    expect(screen.getByText("Spaghetti Bolognese")).toBeInTheDocument();
  });

  it("shows cuisine and difficulty badges", () => {
    const recipe = factories.recipe({
      cuisine: "italian",
      difficulty: "medium",
    });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    expect(screen.getByText("italian")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("displays prep + cook time, servings, and calories", () => {
    const recipe = factories.recipe({
      prep_time: 10,
      cook_time: 20,
      servings: 4,
      calories: 520,
    });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    expect(screen.getByText("30m")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("520 cal")).toBeInTheDocument();
  });

  it("shows star rating with count", () => {
    const recipe = factories.recipe({ rating_avg: 4.3, rating_count: 12 });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    expect(screen.getByText("4.3")).toBeInTheDocument();
    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  it("favourite button calls onToggleFavourite when clicked", () => {
    const onToggle = vi.fn();
    const recipe = factories.recipe({ id: "r-42" });
    renderWithProviders(
      <RecipeCard recipe={recipe} onToggleFavourite={onToggle} />,
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledWith("r-42");
  });

  it("links to /recipes/[id]", () => {
    const recipe = factories.recipe({ id: "abc-123" });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/recipes/abc-123");
  });

  it("shows image placeholder when no image_url", () => {
    const recipe = factories.recipe({ image_url: null });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    // No <img> element should be rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders image when image_url is provided", () => {
    const recipe = factories.recipe({
      image_url: "https://example.com/pasta.jpg",
      title: "Pasta",
    });
    renderWithProviders(<RecipeCard recipe={recipe} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/pasta.jpg");
    expect(img).toHaveAttribute("alt", "Pasta");
  });
});
