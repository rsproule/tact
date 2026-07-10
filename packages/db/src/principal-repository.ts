import { and, eq, isNull } from "drizzle-orm";

import { getDatabase } from "./client";
import { principalIdentities, principals } from "./schema";
import type { PrincipalView } from "./types";

export type IdentityDescriptor = Readonly<{
  kind: "neon_auth" | "agent_token" | "wallet" | "anonymous_session";
  issuer: string;
  subject: string;
  credentialHash?: string;
}>;

export async function findPrincipalByIdentity(
  identity: IdentityDescriptor,
): Promise<PrincipalView | null> {
  const rows = await getDatabase()
    .select({
      id: principals.id,
      kind: principals.kind,
      displayName: principals.displayName,
      credentialHash: principalIdentities.credentialHash,
    })
    .from(principalIdentities)
    .innerJoin(principals, eq(principals.id, principalIdentities.principalId))
    .where(
      and(
        eq(principalIdentities.kind, identity.kind),
        eq(principalIdentities.issuer, identity.issuer),
        eq(principalIdentities.subject, identity.subject),
        isNull(principalIdentities.revokedAt),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  if (identity.credentialHash && row.credentialHash !== identity.credentialHash) return null;
  return { id: row.id, kind: row.kind, displayName: row.displayName };
}

export async function resolveOrCreatePrincipal(input: {
  identity: IdentityDescriptor;
  principalKind: "human" | "agent";
  displayName: string;
}): Promise<PrincipalView> {
  const existing = await findPrincipalByIdentity(input.identity);
  if (existing) return existing;

  return getDatabase().transaction(async (tx) => {
    const rows = await tx
      .select({
        id: principals.id,
        kind: principals.kind,
        displayName: principals.displayName,
        credentialHash: principalIdentities.credentialHash,
      })
      .from(principalIdentities)
      .innerJoin(principals, eq(principals.id, principalIdentities.principalId))
      .where(
        and(
          eq(principalIdentities.kind, input.identity.kind),
          eq(principalIdentities.issuer, input.identity.issuer),
          eq(principalIdentities.subject, input.identity.subject),
          isNull(principalIdentities.revokedAt),
        ),
      )
      .limit(1);

    const current = rows[0];
    if (current) {
      if (
        input.identity.credentialHash &&
        current.credentialHash !== input.identity.credentialHash
      ) {
        throw new Error("Identity credential does not match");
      }
      return { id: current.id, kind: current.kind, displayName: current.displayName };
    }

    const [principal] = await tx
      .insert(principals)
      .values({ kind: input.principalKind, displayName: input.displayName })
      .returning({ id: principals.id, kind: principals.kind, displayName: principals.displayName });

    if (!principal) throw new Error("Principal insert did not return a row");

    const inserted = await tx
      .insert(principalIdentities)
      .values({
        principalId: principal.id,
        kind: input.identity.kind,
        issuer: input.identity.issuer,
        subject: input.identity.subject,
        credentialHash: input.identity.credentialHash,
      })
      .onConflictDoNothing()
      .returning({ id: principalIdentities.id });

    if (inserted.length > 0) return principal;

    // A concurrent request won the unique identity insert. Avoid leaving an
    // orphan and return the winner from inside the same transaction.
    await tx.delete(principals).where(eq(principals.id, principal.id));
    const winners = await tx
      .select({
        id: principals.id,
        kind: principals.kind,
        displayName: principals.displayName,
      })
      .from(principalIdentities)
      .innerJoin(principals, eq(principals.id, principalIdentities.principalId))
      .where(
        and(
          eq(principalIdentities.kind, input.identity.kind),
          eq(principalIdentities.issuer, input.identity.issuer),
          eq(principalIdentities.subject, input.identity.subject),
          isNull(principalIdentities.revokedAt),
        ),
      )
      .limit(1);
    const winner = winners[0];
    if (!winner) throw new Error("Concurrent principal resolution failed");
    return winner;
  });
}

export async function updatePrincipalDisplayName(
  principalId: string,
  displayName: string,
): Promise<PrincipalView> {
  const [principal] = await getDatabase()
    .update(principals)
    .set({ displayName, updatedAt: new Date() })
    .where(eq(principals.id, principalId))
    .returning({ id: principals.id, kind: principals.kind, displayName: principals.displayName });
  if (!principal) throw new Error("Principal not found");
  return principal;
}

export async function revokePrincipalIdentity(identity: IdentityDescriptor): Promise<boolean> {
  const revoked = await getDatabase()
    .update(principalIdentities)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(principalIdentities.kind, identity.kind),
        eq(principalIdentities.issuer, identity.issuer),
        eq(principalIdentities.subject, identity.subject),
        isNull(principalIdentities.revokedAt),
      ),
    )
    .returning({ id: principalIdentities.id });
  return revoked.length > 0;
}
