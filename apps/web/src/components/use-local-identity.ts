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

export function useLocalIdentity(): {
  identity: LocalIdentity | null;
  status: SessionStatus;
  error: string | null;
  suggestedDisplayName: string;
  signIn: (displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => Promise<void>;
} {
  const [identity, setIdentity] = useState<LocalIdentity | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [error, setError] = useState<string | null>(null);
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
      setError(messageOf(caught, "Could not reach the identity service."));
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => {
      try {
        setSuggestedDisplayName(window.localStorage.getItem(DISPLAY_NAME_KEY) ?? "");
      } catch {
        // The signed session cookie remains authoritative when storage is unavailable.
      }
      void load();
    }, 0);
    return () => window.clearTimeout(initial);
  }, [load]);

  const signIn = useCallback(async (displayName: string) => {
    const clean = displayName.trim().replace(/\s+/g, " ").slice(0, 28);
    if (!clean) throw new Error("Choose a display name first.");
    setStatus("loading");
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
      setError(messageOf(caught, "Could not create a guest session."));
      throw caught;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await deleteSession();
    } finally {
      setIdentity(null);
      setStatus("anonymous");
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

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
