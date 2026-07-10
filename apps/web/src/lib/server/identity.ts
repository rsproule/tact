import {
  findPrincipalByIdentity,
  hashJson,
  resolveOrCreatePrincipal,
  revokePrincipalIdentity,
  updatePrincipalDisplayName,
  type IdentityDescriptor,
  type PrincipalView,
} from "@tact/db";

import { ApiError } from "./api-error";

const SESSION_COOKIE = "tact_session";
const SESSION_ISSUER = "tact:anonymous-session:v1";
const AGENT_ISSUER = "tact:agent-token:v1";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type IssuedSession = Readonly<{
  principal: PrincipalView;
  expiresAt: string;
  cookie: string;
}>;

export async function resolveRequestPrincipal(request: Request): Promise<PrincipalView | null> {
  const agentToken = readAgentToken(request);
  if (agentToken) return resolveAgentToken(agentToken, request.headers.get("tact-agent-name"));

  const session = readCookie(request, SESSION_COOKIE);
  if (!session) return null;
  const verified = await verifySessionToken(session);
  if (!verified) return null;
  return findPrincipalByIdentity(anonymousIdentity(verified.subject));
}

export async function requireRequestPrincipal(request: Request): Promise<PrincipalView> {
  const principal = await resolveRequestPrincipal(request);
  if (!principal) {
    throw new ApiError(
      401,
      "authentication_required",
      "Authentication required",
      "Create a browser session or send Tact-Agent-Token.",
    );
  }
  return principal;
}

export async function issueAnonymousSession(displayName: string): Promise<IssuedSession> {
  const subject = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1_000) + SESSION_TTL_SECONDS;
  const token = await signSessionToken(subject, expiresAt);
  const principal = await resolveOrCreatePrincipal({
    identity: anonymousIdentity(subject),
    principalKind: "human",
    displayName,
  });
  return {
    principal,
    expiresAt: new Date(expiresAt * 1_000).toISOString(),
    cookie: serializeSessionCookie(token, SESSION_TTL_SECONDS),
  };
}

export async function refreshAnonymousSession(
  request: Request,
  displayName: string,
): Promise<IssuedSession> {
  const raw = readCookie(request, SESSION_COOKIE);
  const verified = raw ? await verifySessionToken(raw) : null;
  if (!verified) return issueAnonymousSession(displayName);
  const existing = await findPrincipalByIdentity(anonymousIdentity(verified.subject));
  if (!existing) return issueAnonymousSession(displayName);
  const principal = await updatePrincipalDisplayName(existing.id, displayName);
  const expiresAt = Math.floor(Date.now() / 1_000) + SESSION_TTL_SECONDS;
  const token = await signSessionToken(verified.subject, expiresAt);
  return {
    principal,
    expiresAt: new Date(expiresAt * 1_000).toISOString(),
    cookie: serializeSessionCookie(token, SESSION_TTL_SECONDS),
  };
}

export async function revokeAnonymousSession(request: Request): Promise<void> {
  const raw = readCookie(request, SESSION_COOKIE);
  const verified = raw ? await verifySessionToken(raw) : null;
  if (verified) await revokePrincipalIdentity(anonymousIdentity(verified.subject));
}

export function clearSessionCookie(): string {
  return serializeSessionCookie("", 0);
}

export async function issueAgentToken(input: {
  creator: PrincipalView;
  displayName: string;
}): Promise<{ principal: PrincipalView; token: string }> {
  if (input.creator.kind !== "human") {
    throw new ApiError(403, "human_session_required", "Forbidden", "Only a human session can create agent tokens.");
  }
  const random = crypto.getRandomValues(new Uint8Array(32));
  const token = `tact_agent_${toBase64Url(random)}`;
  const tokenHash = await hashJson(token);
  const principal = await resolveOrCreatePrincipal({
    identity: {
      kind: "agent_token",
      issuer: AGENT_ISSUER,
      subject: tokenHash,
      credentialHash: tokenHash,
    },
    principalKind: "agent",
    displayName: input.displayName,
  });
  return { principal, token };
}

/** Adapter target for the Neon Auth SDK once installed by the auth/UI slice. */
export async function resolveVerifiedNeonPrincipal(input: {
  subject: string;
  displayName: string;
  issuer?: string;
}): Promise<PrincipalView> {
  return resolveOrCreatePrincipal({
    identity: {
      kind: "neon_auth",
      issuer: input.issuer ?? process.env.NEON_AUTH_BASE_URL ?? "neon-auth",
      subject: input.subject,
    },
    principalKind: "human",
    displayName: input.displayName,
  });
}

export async function resolveVerifiedMppWalletPrincipal(payer: string): Promise<PrincipalView> {
  const normalized = payer.trim().replace(/0x[0-9a-fA-F]{40}$/, (address) => address.toLowerCase());
  if (normalized.length < 8 || normalized.length > 512) {
    throw new ApiError(401, "invalid_payment_identity", "Invalid payer identity", "Verified payment payer is malformed.");
  }
  return resolveOrCreatePrincipal({
    identity: {
      kind: "wallet",
      issuer: "tact:mpp:tempo",
      subject: normalized,
    },
    principalKind: "agent",
    displayName: `Tempo Agent ${normalized.slice(-8)}`,
  });
}

async function resolveAgentToken(token: string, requestedName: string | null): Promise<PrincipalView> {
  if (!token.startsWith("tact_agent_") || token.length < 43 || token.length > 256) {
    throw new ApiError(401, "invalid_agent_token", "Invalid agent token", "Agent token is malformed.");
  }
  const tokenHash = await hashJson(token);
  const identity: IdentityDescriptor = {
    kind: "agent_token",
    issuer: AGENT_ISSUER,
    subject: tokenHash,
    credentialHash: tokenHash,
  };
  const existing = await findPrincipalByIdentity(identity);
  if (existing) return existing;
  throw new ApiError(
    401,
    "unknown_agent_token",
    "Unknown agent token",
    requestedName
      ? "Create this agent token through an authenticated human session first."
      : "Agent token has not been provisioned.",
  );
}

function readAgentToken(request: Request): string | null {
  const direct = request.headers.get("tact-agent-token")?.trim();
  if (direct) return direct;
  const authorization = request.headers.get("authorization")?.trim();
  if (!authorization?.toLowerCase().startsWith("bearer ")) return null;
  const bearer = authorization.slice(7).trim();
  return bearer.startsWith("tact_agent_") ? bearer : null;
}

function anonymousIdentity(subject: string): IdentityDescriptor {
  return { kind: "anonymous_session", issuer: SESSION_ISSUER, subject };
}

async function signSessionToken(subject: string, expiresAt: number): Promise<string> {
  const payload = `v1.${subject}.${expiresAt}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

async function verifySessionToken(
  token: string,
): Promise<{ subject: string; expiresAt: number } | null> {
  const [version, subject, expiresRaw, signature, ...rest] = token.split(".");
  if (rest.length > 0 || version !== "v1" || !subject || !expiresRaw || !signature) return null;
  if (!/^[0-9a-f-]{36}$/i.test(subject)) return null;
  const expiresAt = Number(expiresRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1_000)) return null;
  const expected = await hmac(`${version}.${subject}.${expiresRaw}`);
  return constantTimeEqual(signature, expected) ? { subject, expiresAt } : null;
}

async function hmac(value: string): Promise<string> {
  const secret = process.env.TACT_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new ApiError(
      503,
      "sign_in_unavailable",
      "Sign-in unavailable",
      "Players cannot sign in right now.",
    );
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const entry of header.split(";")) {
    const separator = entry.indexOf("=");
    if (separator < 0) continue;
    if (entry.slice(0, separator).trim() === name) {
      return decodeURIComponent(entry.slice(separator + 1).trim());
    }
  }
  return null;
}

function serializeSessionCookie(value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
