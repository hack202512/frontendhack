import { fetchWithAuth } from "@/utils/fetchWithAuth";

export function useAuthFetch() {
  const authFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return fetchWithAuth(url, options);
  };

  return { authFetch };
}

