import { ApiError } from "./api-error";

const MAX_JSON_BYTES = 64 * 1024;

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (contentType !== "application/json") {
    throw new ApiError(
      415,
      "unsupported_media_type",
      "JSON required",
      "Content-Type must be application/json.",
    );
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_JSON_BYTES) {
    throw new ApiError(413, "body_too_large", "Request too large", "JSON body exceeds 64 KiB.");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) {
    throw new ApiError(413, "body_too_large", "Request too large", "JSON body exceeds 64 KiB.");
  }
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new ApiError(400, "invalid_json", "Invalid JSON", "Body must be a JSON object.");
  }
}

export function requireString(
  value: unknown,
  name: string,
  options: { min?: number; max?: number; pattern?: RegExp } = {},
): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  const min = options.min ?? 1;
  const max = options.max ?? 256;
  if (
    normalized.length < min ||
    normalized.length > max ||
    (options.pattern && !options.pattern.test(normalized))
  ) {
    throw new ApiError(400, "invalid_request", "Invalid request", `${name} is invalid.`, {
      field: name,
    });
  }
  return normalized;
}

export function requireInteger(
  value: unknown,
  name: string,
  options: { min?: number; max?: number } = {},
): number {
  if (
    !Number.isSafeInteger(value) ||
    (options.min !== undefined && (value as number) < options.min) ||
    (options.max !== undefined && (value as number) > options.max)
  ) {
    throw new ApiError(400, "invalid_request", "Invalid request", `${name} is invalid.`, {
      field: name,
    });
  }
  return value as number;
}

export function requireUuid(value: unknown, name: string): string {
  return requireString(value, name, {
    min: 36,
    max: 36,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  });
}

export function requestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
