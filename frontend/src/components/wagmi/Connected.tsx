"use client";

import { useAccount } from "wagmi";
import ManifestoPage from "@/src/app/manifesto/page";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) return <ManifestoPage />;
  // before deployment
  return <ManifestoPage />;
  // return <>{children}</>;
}
