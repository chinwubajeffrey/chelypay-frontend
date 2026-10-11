// Browser-side helper. Talks only to our own /api routes, never the Express API.
export async function callApi<T = unknown>(
  url: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? "POST",
    headers: { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = await res.json().catch(() => null);

  if (res.status === 401 && !url.startsWith("/api/auth/")) {
    // Full reload on purpose: clears all client state when the session is gone.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login?expired=1";
  }
  if (!res.ok) {
    const message =
      data && typeof data === "object" && typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Something went wrong. Try again.";
    throw new Error(message);
  }
  return data as T;
}
