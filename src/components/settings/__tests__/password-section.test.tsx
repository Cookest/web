import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers";
import { PasswordSection } from "../password-section";

const mockChangePassword = vi.fn();

vi.mock("@/lib/api", () => ({
  api: {
    changePassword: (...args: unknown[]) => mockChangePassword(...args),
  },
}));

describe("PasswordSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders password fields", () => {
    renderWithProviders(<PasswordSection />);

    expect(screen.getByPlaceholderText("Current password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
  });

  it("shows error when new passwords don't match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordSection />);

    await user.type(screen.getByPlaceholderText(/current password/i), "oldpass");
    await user.type(screen.getByPlaceholderText(/^new password$/i), "newpass123");
    await user.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "different"
    );
    await user.click(screen.getByRole("button", { name: /change password/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("shows error when current password missing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordSection />);

    await user.type(screen.getByPlaceholderText(/^new password$/i), "newpass123");
    await user.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "newpass123"
    );
    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith("", "newpass123");
    });
  });

  it("calls changePassword API on valid submit", async () => {
    mockChangePassword.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderWithProviders(<PasswordSection />);

    await user.type(screen.getByPlaceholderText(/current password/i), "oldpass");
    await user.type(screen.getByPlaceholderText(/^new password$/i), "newpass123");
    await user.type(
      screen.getByPlaceholderText(/confirm new password/i),
      "newpass123"
    );
    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith("oldpass", "newpass123");
    });

    expect(
      screen.getByText(/password changed successfully/i)
    ).toBeInTheDocument();
  });
});
