import { API_URL } from "@/config/api";
import { getRefreshToken, setTokens, clearTokens, getAuthHeader } from "@/utils/auth";

let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;

async function refreshToken(): Promise<boolean> {
  if (refreshPromise) {
    try {
      await refreshPromise;
      return true;
    } catch {
      return false;
    }
  }

  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    return false;
  }

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshTokenValue}`,
    },
  });

  try {
    const response = await refreshPromise;
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    const data = await response.json();
    if (data.access_token) {
      const currentRefreshToken = getRefreshToken();
      if (currentRefreshToken) {
        setTokens(data.access_token, currentRefreshToken);
      }
      return true;
    }
    return false;
  } catch {
    clearTokens();
    return false;
  } finally {
    refreshPromise = null;
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  const authHeader = getAuthHeader();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = isFormData
    ? { ...(options.headers as Record<string, string>) }
    : {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

  if (authHeader && !url.includes("/auth/login") && !url.includes("/auth/register")) {
    headers["Authorization"] = authHeader;
  }

  let response = await fetch(fullUrl, {
    ...options,
    headers: headers as HeadersInit,
  });

  if (
    response.status === 401 &&
    !url.includes("/auth/refresh") &&
    !url.includes("/auth/login") &&
    !url.includes("/auth/register")
  ) {
    const refreshed = await refreshToken();
    if (refreshed) {
      const newAuthHeader = getAuthHeader();
      if (newAuthHeader) {
        headers["Authorization"] = newAuthHeader;
      }
      response = await fetch(fullUrl, {
        ...options,
        headers: headers as HeadersInit,
      });
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}

