import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers";
import { RecipeFilters } from "../recipe-filters";

const defaultProps = {
  searchInput: "",
  onSearchInputChange: vi.fn(),
  onSearch: vi.fn(),
  filtersOpen: true,
  onToggleFilters: vi.fn(),
  cuisine: "",
  difficulty: "",
  dietary: "",
  maxTime: 0,
  onUpdateParams: vi.fn(),
  onClearAll: vi.fn(),
};

describe("RecipeFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    renderWithProviders(<RecipeFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/search recipes/i)
    ).toBeInTheDocument();
  });

  it("renders cuisine filter options", () => {
    renderWithProviders(<RecipeFilters {...defaultProps} />);

    expect(screen.getByText(/italian/i)).toBeInTheDocument();
    expect(screen.getByText(/asian/i)).toBeInTheDocument();
    expect(screen.getByText(/mediterranean/i)).toBeInTheDocument();
  });

  it("renders difficulty filter options", () => {
    renderWithProviders(<RecipeFilters {...defaultProps} />);

    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/hard/i)).toBeInTheDocument();
  });

  it("calls onSearchInputChange when search changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeFilters {...defaultProps} />);

    await user.type(screen.getByPlaceholderText(/search recipes/i), "pasta");

    expect(defaultProps.onSearchInputChange).toHaveBeenCalled();
  });

  it("clear filters button resets all filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeFilters {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /clear all filters/i }));

    expect(defaultProps.onClearAll).toHaveBeenCalled();
  });
});
