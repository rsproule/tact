import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { getDatabase } from "./client";
import { mppStore } from "./schema";

export type AtomicChange<Value, Result> =
  | { op: "noop"; result: Result }
  | { op: "set"; value: Value; result: Result }
  | { op: "delete"; result: Result };

/** Structural equivalent of mppx Store.AtomicStore without coupling db to mppx. */
export interface NeonAtomicStore<ItemMap extends Record<string, unknown> = Record<string, unknown>> {
  get<Key extends keyof ItemMap & string>(key: Key): Promise<ItemMap[Key] | null>;
  put<Key extends keyof ItemMap & string>(key: Key, value: ItemMap[Key]): Promise<void>;
  delete<Key extends keyof ItemMap & string>(key: Key): Promise<void>;
  update<Key extends keyof ItemMap & string, Result>(
    key: Key,
    update: (current: ItemMap[Key] | null) => AtomicChange<ItemMap[Key], Result>,
  ): Promise<Result>;
}

export function createMppAtomicStore<
  ItemMap extends Record<string, unknown> = Record<string, unknown>,
>(): NeonAtomicStore<ItemMap> {
  return {
    async get(key) {
      const rows = await getDatabase()
        .select({ value: mppStore.value })
        .from(mppStore)
        .where(
          and(
            eq(mppStore.key, key),
            or(isNull(mppStore.expiresAt), gt(mppStore.expiresAt, new Date())),
          ),
        )
        .limit(1);
      return (rows[0]?.value as ItemMap[typeof key] | undefined) ?? null;
    },

    async put(key, value) {
      await getDatabase()
        .insert(mppStore)
        .values({ key, value, expiresAt: null, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: mppStore.key,
          set: { value, expiresAt: null, updatedAt: new Date() },
        });
    },

    async delete(key) {
      await getDatabase().delete(mppStore).where(eq(mppStore.key, key));
    },

    async update(key, update) {
      return getDatabase().transaction(async (tx) => {
        // The placeholder makes concurrent first-writers serialize on the PK.
        await tx
          .insert(mppStore)
          .values({ key, value: null })
          .onConflictDoNothing({ target: mppStore.key });
        await tx.execute(sql`select ${mppStore.key} from ${mppStore} where ${mppStore.key} = ${key} for update`);
        const rows = await tx
          .select({ value: mppStore.value, expiresAt: mppStore.expiresAt })
          .from(mppStore)
          .where(eq(mppStore.key, key))
          .limit(1);
        const row = rows[0];
        const current =
          row && (!row.expiresAt || row.expiresAt.getTime() > Date.now())
            ? (row.value as ItemMap[typeof key] | null)
            : null;
        const change = update(current);

        if (change.op === "set") {
          await tx
            .update(mppStore)
            .set({ value: change.value, expiresAt: null, updatedAt: new Date() })
            .where(eq(mppStore.key, key));
        } else if (change.op === "delete") {
          await tx.delete(mppStore).where(eq(mppStore.key, key));
        }
        return change.result;
      });
    },
  };
}

export async function putMppValueWithExpiry(
  key: string,
  value: unknown,
  expiresAt: Date,
): Promise<void> {
  await getDatabase()
    .insert(mppStore)
    .values({ key, value, expiresAt, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: mppStore.key,
      set: { value, expiresAt, updatedAt: new Date() },
    });
}
