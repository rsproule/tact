"use client";

import { useAccount } from "wagmi";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected)
    return (
      <div className="flex justify-center">
        Connect Wallet to play. I promise this isn't a rug (it't on goerli).
        Code is here: https://github.com/rsproule/tanks
      </div>
    );
  return <>{children}</>;
}
