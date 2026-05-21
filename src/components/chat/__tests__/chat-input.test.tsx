import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers";
import { ChatInput } from "../chat-input";

const defaultProps = {
  onSend: vi.fn(),
  isSending: false,
};

describe("ChatInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea", () => {
    renderWithProviders(<ChatInput {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(/message ai chef/i)
    ).toBeInTheDocument();
  });

  it("calls onSend with message text", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInput {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText(/message ai chef/i),
      "How do I make pasta?"
    );
    await user.click(screen.getByRole("button"));

    expect(defaultProps.onSend).toHaveBeenCalledWith("How do I make pasta?");
  });

  it("clears input after sending", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInput {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/message ai chef/i);
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button"));

    expect(textarea).toHaveValue("");
  });

  it("disables send when isSending is true", () => {
    renderWithProviders(<ChatInput {...defaultProps} isSending={true} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("send button is disabled when input is empty", () => {
    renderWithProviders(<ChatInput {...defaultProps} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
