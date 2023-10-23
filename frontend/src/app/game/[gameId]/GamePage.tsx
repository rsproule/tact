"use client";

import { EventStream } from "@/src/components/tankGame/EventsStream";
import { TankGame } from "@/src/components/tankGame/TankGame";
import { Toaster } from "@/src/components/ui/toaster";
import { useTankGameGetSettings } from "@/src/generated";

export function GamePage({ gameAddress }: { gameAddress: `0x${string}` }) {
  let settings = useTankGameGetSettings({
    watch: true,
    // @ts-ignore
    address: gameAddress,
  });
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
