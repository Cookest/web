import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { PageHeader } from "@/components/page-header";
import { renderWithProviders } from "@/__tests__/helpers";

describe("PageHeader", () => {
  it("renders title in serif font", () => {
    renderWithProviders(<PageHeader title="My Recipes" />);
    const heading = screen.getByRole("heading", { name: "My Recipes" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("font-serif");
  });

  it("renders subtitle when provided", () => {
    renderWithProviders(
      <PageHeader title="Recipes" subtitle="Browse your collection" />,
    );
    expect(screen.getByText("Browse your collection")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = renderWithProviders(<PageHeader title="Recipes" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders action slot when provided", () => {
    renderWithProviders(
      <PageHeader
        title="Recipes"
        action={<button type="button">Add Recipe</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Add Recipe" }),
    ).toBeInTheDocument();
  });
});
