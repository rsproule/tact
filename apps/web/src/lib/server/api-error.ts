import { DatabaseConfigurationError, RepositoryError } from "@tact/db";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly title: string,
    message: string,
    readonly details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function problemResponse(error: unknown): Response {
  const apiError = normalizeApiError(error);
  return Response.json(
    {
      type: `https://tact.game/problems/${apiError.code}`,
      title: apiError.title,
      status: apiError.status,
      detail: apiError.message,
      code: apiError.code,
      ...(Object.keys(apiError.details).length > 0 ? { details: apiError.details } : {}),
    },
    {
      status: apiError.status,
      headers: {
        "content-type": "application/problem+json",
        "cache-control": "no-store",
      },
    },
  );
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof DatabaseConfigurationError) {
    return new ApiError(
      503,
      "service_unavailable",
      "Tact unavailable",
      "Tact is temporarily unavailable.",
    );
  }
  if (error instanceof RepositoryError) {
    const status =
      error.code === "game_not_found"
        ? 404
        : error.code === "command_in_progress"
          ? 425
          : 409;
    const message =
      error.code === "game_not_found"
        ? "No match exists with that id."
        : error.code === "command_in_progress"
          ? "That move is still being processed."
          : "The game changed; refetch it and retry.";
    return new ApiError(status, error.code, "Game command conflict", message, error.details);
  }

  // Rule errors are structural to avoid importing unstable engine internals here.
  if (error && typeof error === "object" && "code" in error) {
    const candidate = error as { code?: unknown; message?: unknown; details?: unknown };
    if (typeof candidate.code === "string") {
      return new ApiError(
        422,
        candidate.code,
        "Game rule rejected the command",
        typeof candidate.message === "string" ? candidate.message : "Command rejected",
        candidate.details && typeof candidate.details === "object"
          ? (candidate.details as Record<string, unknown>)
          : {},
      );
    }
  }

  console.error("Unhandled API error", error);
  return new ApiError(
    500,
    "internal_error",
    "Tact error",
    "Tact could not complete the request.",
  );
}

export function commandRejectionResponse(receipt: {
  errorCode?: string;
  result: Record<string, unknown>;
}): Response {
  const code = receipt.errorCode ?? "command_rejected";
  const message =
    typeof receipt.result.message === "string" ? receipt.result.message : "Command rejected";
  const status = code === "stale_game_version" ? 409 : code === "not_authorized" ? 403 : 422;
  return problemResponse(
    new ApiError(status, code, "Game command rejected", message, {
      ...(receipt.result.details && typeof receipt.result.details === "object"
        ? (receipt.result.details as Record<string, unknown>)
        : {}),
      replayed: "replayed" in receipt ? Boolean(receipt.replayed) : false,
    }),
  );
}
