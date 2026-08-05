interface FetchWithTimeoutRetryOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
}

export default async function fetchWithTimeoutRetry(
  url: string,
  { timeoutMs = 5000, retries = 1, ...init }: FetchWithTimeoutRetryOptions = {},
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (error) {
      clearTimeout(timeout);
      const isAbort = error instanceof Error && error.name === "AbortError";
      if (isAbort && attempt < retries) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("fetchWithTimeoutRetry: exhausted retries");
}
