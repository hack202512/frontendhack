import { API_URL } from "@/config/api";

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

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await refreshPromise;
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    return true;
  } catch {
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

  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? { ...options.headers }
    : {
        "Content-Type": "application/json",
        ...options.headers,
      };

  let response = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers,
  });

  if (
    response.status === 401 &&
    !url.includes("/auth/refresh") &&
    !url.includes("/auth/login") &&
    !url.includes("/auth/register")
  ) {
    const refreshed = await refreshToken();
    if (refreshed) {
      response = await fetch(fullUrl, {
        ...options,
        credentials: "include",
        headers,
      });
    }
  }

  return response;
}

