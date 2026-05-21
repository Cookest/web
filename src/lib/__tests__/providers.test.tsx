import { render, screen } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import { Providers } from "../providers";
import { useAuth } from "../auth";

vi.mock("@/lib/api", () => ({
  api: {
    login: vi.fn(),
    getProfile: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(() => null),
  },
}));

function QueryClientConsumer() {
  const queryClient = useQueryClient();
  return <div data-testid="qc">{queryClient ? "has-query-client" : "no-query-client"}</div>;
}

function AuthConsumer() {
  const auth = useAuth();
  return <div data-testid="auth">{auth ? "has-auth" : "no-auth"}</div>;
}

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <div data-testid="child">Hello</div>
      </Providers>
    );

    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });

  it("provides QueryClient context", () => {
    render(
      <Providers>
        <QueryClientConsumer />
      </Providers>
    );

    expect(screen.getByTestId("qc")).toHaveTextContent("has-query-client");
  });

  it("provides Auth context", () => {
    render(
      <Providers>
        <AuthConsumer />
      </Providers>
    );

    expect(screen.getByTestId("auth")).toHaveTextContent("has-auth");
  });
});
