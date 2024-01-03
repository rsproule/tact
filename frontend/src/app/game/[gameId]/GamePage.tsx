"use client";

import { EventStream } from "@/src/components/tankGame/EventsStream";
import { TankGame } from "@/src/components/tankGame/TankGame";
import { Toaster } from "@/src/components/ui/toaster";
import { gameViewAddress, useGameViewGetSettings } from "@/src/generated";
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";

export function GamePage({ gameAddress }: { gameAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  let settings = useGameViewGetSettings({
    watch: true,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [gameAddress],
  });
  if (!address)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        You must connect your wallet, choncho
      </div>
    );
  return settings.data ? (
    <div className="container">
      <TankGame address={gameAddress as `0x${string}`} />
      <EventStream address={gameAddress! as `0x${string}`} />
      <Toaster />
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Game not found at address: {gameAddress}
      <br />
      <Link href="/games">Back to Games</Link>
    </div>
  );
}
