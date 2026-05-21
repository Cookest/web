import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Flame } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { renderWithProviders } from "@/__tests__/helpers";

describe("StatCard", () => {
  it("renders label and value", () => {
    renderWithProviders(
      <StatCard icon={Flame} label="Calories" value={2100} />,
    );
    expect(screen.getByText("Calories")).toBeInTheDocument();
    expect(screen.getByText("2100")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    const { container } = renderWithProviders(
      <StatCard icon={Flame} label="Calories" value={2100} />,
    );
    // Lucide icons render as <svg> elements
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom iconClassName", () => {
    const { container } = renderWithProviders(
      <StatCard
        icon={Flame}
        label="Calories"
        value={2100}
        iconClassName="bg-red-100"
      />,
    );
    const iconWrapper = container.querySelector(".bg-red-100");
    expect(iconWrapper).toBeInTheDocument();
  });
});
