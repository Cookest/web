import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  RecipeCardSkeleton,
  StatCardSkeleton,
  GridSkeleton,
} from "@/components/skeletons";

describe("RecipeCardSkeleton", () => {
  it("renders with animate-pulse", () => {
    const { container } = render(<RecipeCardSkeleton />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});

describe("StatCardSkeleton", () => {
  it("renders with animate-pulse", () => {
    const { container } = render(<StatCardSkeleton />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});

describe("GridSkeleton", () => {
  it("renders correct number of items based on count prop", () => {
    const { container } = render(<GridSkeleton count={6} />);
    const items = container.querySelectorAll(".animate-pulse");
    expect(items).toHaveLength(6);
  });

  it("defaults to 8 items when count is not provided", () => {
    const { container } = render(<GridSkeleton />);
    const items = container.querySelectorAll(".animate-pulse");
    expect(items).toHaveLength(8);
  });
});
