"use client";

import { useAccount } from "wagmi";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected)
    return (
      <div className="flex justify-center">
        <span className="pr-1">{`
        Connect Wallet to play. I promise this isn't a rug (it's also just on
        goerli for now). Code is here: 
        `}</span>{" "}
        <a
          className="text-blue-600"
          href="https://github.com/rsproule/tanks"
        >
          https://github.com/rsproule/tanks
        </a>
      </div>
    );
  return <>{children}</>;
}
