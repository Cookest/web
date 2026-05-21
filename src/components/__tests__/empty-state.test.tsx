import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { UtensilsCrossed } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { renderWithProviders } from "@/__tests__/helpers";

describe("EmptyState", () => {
  it("renders title and description", () => {
    renderWithProviders(
      <EmptyState
        icon={UtensilsCrossed}
        title="No recipes"
        description="Start by adding your first recipe."
      />,
    );
    expect(screen.getByText("No recipes")).toBeInTheDocument();
    expect(
      screen.getByText("Start by adding your first recipe."),
    ).toBeInTheDocument();
  });

  it("shows action button with label", () => {
    renderWithProviders(
      <EmptyState
        icon={UtensilsCrossed}
        title="No recipes"
        description="Start adding."
        action={{ label: "Add Recipe", onClick: vi.fn() }}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Add Recipe" }),
    ).toBeInTheDocument();
  });

  it("action button links to href when provided", () => {
    renderWithProviders(
      <EmptyState
        icon={UtensilsCrossed}
        title="No recipes"
        description="Start adding."
        action={{ label: "Browse", href: "/recipes" }}
      />,
    );
    const link = screen.getByRole("link", { name: "Browse" });
    expect(link).toHaveAttribute("href", "/recipes");
  });

  it("action button calls onClick when provided", () => {
    const onClick = vi.fn();
    renderWithProviders(
      <EmptyState
        icon={UtensilsCrossed}
        title="No recipes"
        description="Start adding."
        action={{ label: "Create", onClick }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not render action when not provided", () => {
    renderWithProviders(
      <EmptyState
        icon={UtensilsCrossed}
        title="No recipes"
        description="Nothing here."
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
