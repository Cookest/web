import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers";
import { GenerateModal } from "../generate-modal";

// Radix Checkbox uses ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock;

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onGenerate: vi.fn(),
  isGenerating: false,
};

describe("GenerateModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open is true", () => {
    renderWithProviders(<GenerateModal {...defaultProps} />);

    expect(screen.getByText(/generate meal plan/i)).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    renderWithProviders(<GenerateModal {...defaultProps} open={false} />);

    expect(screen.queryByText(/generate meal plan/i)).not.toBeInTheDocument();
  });

  it("shows date input and cuisine checkboxes", () => {
    renderWithProviders(<GenerateModal {...defaultProps} />);

    expect(screen.getByText(/week starting/i)).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Asian")).toBeInTheDocument();
    expect(screen.getByText("Mediterranean")).toBeInTheDocument();
    expect(screen.getByText("Mexican")).toBeInTheDocument();
  });

  it("calls onGenerate with correct data", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GenerateModal {...defaultProps} />);

    await user.click(screen.getByText("Italian"));
    await user.click(
      screen.getByRole("button", { name: /generate plan/i })
    );

    expect(defaultProps.onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        week_start: expect.any(String),
        preferences: expect.objectContaining({
          cuisines: expect.arrayContaining(["italian"]),
        }),
      })
    );
  });

  it("shows loading state when isGenerating", () => {
    renderWithProviders(
      <GenerateModal {...defaultProps} isGenerating={true} />
    );

    expect(screen.getByText(/generating/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generating/i })
    ).toBeDisabled();
  });
});
