import { API_URL } from "@/config/api";

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

    const response = await fetch(fullUrl, {
      ...options,
      credentials: "include",
      headers,
    });

    return response;
  };

  return { authFetch };
}

