"use client";

import { EventStream } from "@/src/components/tankGame/EventsStream";
import { TankGame } from "@/src/components/tankGame/TankGame";
import { Toaster } from "@/src/components/ui/toaster";
import { gameViewAddress, useGameViewGetSettings } from "@/src/generated";
import { useNetwork } from "wagmi";

export function GamePage({ gameAddress }: { gameAddress: `0x${string}` }) {
  const { chain } = useNetwork();
  let settings = useGameViewGetSettings({
    watch: true,
    // @ts-ignore
    address : gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [gameAddress]
  });
  console.log(settings);
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
      404: Game Not Found
    </div>
  );
}
