const getApiUrl = (): string => {
  const envUrl = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
      return `https://${envUrl}`;
    }
    return envUrl;
  }
  
  return "http://localhost:8000";
};

export const API_URL: string = getApiUrl();



