export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(message: string, code = "ERR_INTERNAL", status = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  const msg = e instanceof Error ? e.message : String(e);
  return new AppError(msg);
}

export function errorResponse(e: unknown): Response {
  const err = toError(e);
  const safe =
    err.status >= 500 || err.status === 0
      ? { code: "ERR_INTERNAL", message: "Something went wrong on our side. Please retry." }
      : { code: err.code, message: err.message, ...(err.details !== undefined ? { details: err.details } : {}) };
  return Response.json(safe, { status: err.status, headers: { "Cache-Control": "no-store" } });
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}