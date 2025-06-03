const API_BASE_URL =  "https://fb28766746d314d5.mokky.dev"
class ApiError extends Error {
  constructor(public response: Response) {
    super("ApiError:" + response.status);
  }
}
export const apiCall = async <T>(
  endpoint: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> => {
  let headers = init?.headers ?? {};

  if (init?.json) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };

    init.body = JSON.stringify(init.json);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new ApiError(response);
  }
  const text = await response.text();
  if (!text) return {} as T;

  return JSON.parse(text);
}