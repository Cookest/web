import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/helpers";

const mockLogout = vi.fn();

vi.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: { name: "Test User", email: "test@example.com", tier: "pro" },
    logout: mockLogout,
  }),
}));

// Must import after vi.mock
import { Sidebar } from "@/components/sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  it("renders Cookest branding", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Cookest")).toBeInTheDocument();
    expect(screen.getByText("Meal Planning")).toBeInTheDocument();
  });

  it("renders all main navigation links", () => {
    renderWithProviders(<Sidebar />);
    const expectedLinks = [
      "Home",
      "Recipes",
      "Meal Plans",
      "Pantry",
      "Groceries",
      "Favourites",
      "AI Chef",
    ];
    for (const label of expectedLinks) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renders bottom navigation links", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Subscription")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("shows user info when authenticated", () => {
    renderWithProviders(<Sidebar />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("pro")).toBeInTheDocument();
  });

  it("highlights active nav item", () => {
    // usePathname is mocked to return "/" in setup.ts
    renderWithProviders(<Sidebar />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveClass("nav-link-active");
  });

  it("logout button calls logout", () => {
    renderWithProviders(<Sidebar />);
    const logoutBtn = screen.getByText("Log Out");
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
