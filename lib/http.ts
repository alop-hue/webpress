import { AppError } from "./errors";

export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "same-origin",
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new AppError("Network error — check your connection.", "ERR_NETWORK", 0);
  }
  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) {
    throw new AppError(body?.message || `Request failed (${res.status})`, body?.code || "ERR_HTTP", res.status);
  }
  return body as T;
}