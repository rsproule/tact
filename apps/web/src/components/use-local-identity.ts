"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createSession,
  deleteSession,
  getSession,
  type LocalIdentity,
} from "./game-client";

const DISPLAY_NAME_KEY = "tact.last-display-name.v1";

export type SessionStatus = "loading" | "anonymous" | "authenticated";

export function useLocalIdentity(
  initialIdentity?: LocalIdentity | null,
  initialError: string | null = null,
): {
  identity: LocalIdentity | null;
  status: SessionStatus;
  error: string | null;
  suggestedDisplayName: string;
  signIn: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => Promise<void>;
} {
  const hasServerSession = initialIdentity !== undefined;
  const [identity, setIdentity] = useState<LocalIdentity | null>(initialIdentity ?? null);
  const [status, setStatus] = useState<SessionStatus>(
    hasServerSession
      ? initialIdentity
        ? "authenticated"
        : "anonymous"
      : "loading",
  );
  const [error, setError] = useState<string | null>(initialError);
  const [suggestedDisplayName, setSuggestedDisplayName] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const session = await getSession();
      setIdentity(session);
      setStatus(session ? "authenticated" : "anonymous");
    } catch (caught) {
      setIdentity(null);
      setStatus("anonymous");
      setError(messageOf(caught, "Could not open Tact."));
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      try {
        setSuggestedDisplayName(window.localStorage.getItem(DISPLAY_NAME_KEY) ?? "");
      } catch {
        // The signed session cookie remains authoritative when storage is unavailable.
      }
      if (!hasServerSession) void load();
    }, 0);
    return () => window.clearTimeout(initial);
  }, [hasServerSession, load]);

  const signIn = useCallback(async (displayName: string) => {
    const clean = displayName.trim().replace(/\s+/g, " ").slice(0, 28);
    if (!clean) throw new Error("Choose a display name first.");
    setError(null);
    try {
      const session = await createSession(clean);
      setIdentity(session);
      setStatus("authenticated");
      setSuggestedDisplayName(session.handle);
      try {
        window.localStorage.setItem(DISPLAY_NAME_KEY, session.handle);
      } catch {
        // Remembering the display name is a convenience, not identity authority.
      }
    } catch (caught) {
      setStatus("anonymous");
      setError(messageOf(caught, "Could not enter Tact."));
      throw caught;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await deleteSession();
      setIdentity(null);
      setStatus("anonymous");
    } catch (caught) {
      setError(messageOf(caught, "Could not change players."));
      throw caught;
    }
  }, []);

  return {
    identity,
    status,
    error,
    suggestedDisplayName,
    signIn,
    signOut,
    retry: load,
  };
}

function messageOf(_error: unknown, fallback: string): string {
  return fallback;
}
