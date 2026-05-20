import { getConfig } from "./template";

const API_URL = getConfig((config) => config.template.apiUrl);
const ECO_URL = getConfig((config) => config.template.ecoUrl);

const mockUrls = import.meta.glob<{ default: string }>("../mock/*.json", {
  query: "url",
  eager: true,
});

export async function request<T>(
  path: string,
  options?: RequestInit & { baseUrl?: "api" | "eco" }
): Promise<T> {
  const baseUrl = options?.baseUrl === "eco" ? ECO_URL : API_URL;
  const url = `${baseUrl}${path}`;

  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers || {}),
    },
  });
  return response.json() as T;
}

export async function requestWithFallback<T>(
  path: string,
  fallbackValue: T,
  options?: RequestInit & { baseUrl?: "api" | "eco" }
): Promise<T> {
  try {
    return await request<T>(path, options);
  } catch (error) {
    console.warn(
      "An error occurred while fetching data. Falling back to default value!"
    );
    console.warn({ path, error, fallbackValue });
    return fallbackValue;
  }
}
