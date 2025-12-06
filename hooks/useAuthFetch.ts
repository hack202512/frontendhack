import { API_URL } from "@/config/api";

let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;

async function refreshToken(): Promise<Response> {
  if (refreshPromise) {
    return refreshPromise;
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
    return response;
  } finally {
    refreshPromise = null;
  }
}

export function useAuthFetch() {
  const authFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
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

    if (response.status === 401 && !url.includes("/auth/refresh") && !url.includes("/auth/login")) {
      try {
        await refreshToken();
        response = await fetch(fullUrl, {
          ...options,
          credentials: "include",
          headers,
        });
      } catch (error) {
        return response;
      }
    }

    return response;
  };

  return { authFetch };
}

