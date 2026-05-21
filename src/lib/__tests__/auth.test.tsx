import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { AuthProvider, useAuth } from "../auth";
import { factories } from "@/__tests__/helpers";

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

import { api } from "@/lib/api";

const mockedApi = api as unknown as {
  login: ReturnType<typeof vi.fn>;
  getProfile: ReturnType<typeof vi.fn>;
  logout: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  setToken: ReturnType<typeof vi.fn>;
  getToken: ReturnType<typeof vi.fn>;
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

describe("AuthProvider & useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.getToken.mockReturnValue(null);
  });

  it("provides authentication state to children", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("isAuthenticated is false when no user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("login calls api.login and fetches profile", async () => {
    const user = factories.user();
    mockedApi.login.mockResolvedValue({ access_token: "tok", token_type: "bearer", expires_in: 3600 });
    mockedApi.getProfile.mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(mockedApi.login).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });
    expect(mockedApi.getProfile).toHaveBeenCalled();
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("logout clears user state", async () => {
    const user = factories.user();
    mockedApi.login.mockResolvedValue({ access_token: "tok", token_type: "bearer", expires_in: 3600 });
    mockedApi.getProfile.mockResolvedValue(user);
    mockedApi.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockedApi.setToken).toHaveBeenCalledWith(null);
  });

  it("refreshUser fetches profile", async () => {
    const user = factories.user();
    mockedApi.getProfile.mockResolvedValue(user);

    // Simulate having a token so initial load triggers refreshUser
    mockedApi.getToken.mockReturnValue("existing-token");

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockedApi.getProfile).toHaveBeenCalled();
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    expect(() => {
      renderHook(() => useAuth(), { wrapper });
    }).toThrow("useAuth must be used within an AuthProvider");
  });

  it("sets user to null and clears token when refreshUser fails", async () => {
    mockedApi.getToken.mockReturnValue("bad-token");
    mockedApi.getProfile.mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockedApi.setToken).toHaveBeenCalledWith(null);
  });

  it("clears state even if api.logout rejects", async () => {
    const user = factories.user();
    mockedApi.login.mockResolvedValue({ access_token: "tok", token_type: "bearer", expires_in: 3600 });
    mockedApi.getProfile.mockResolvedValue(user);
    mockedApi.logout.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login("test@example.com", "pass");
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockedApi.setToken).toHaveBeenCalledWith(null);
  });
});
