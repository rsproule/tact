import { EventStream } from "@/src/components/tankGame/EventsStream";
import { TankGame } from "@/src/components/tankGame/TankGame";
import { Toaster } from "@/src/components/ui/toaster";
import { Connected } from "@/src/components/wagmi/Connected.1";

export default function Page({ params }: { params: { gameId: string } }) {
  return (
    <Connected>
      <div>Game contract: {params.gameId}</div>
      <TankGame />
      <EventStream />
      <Toaster />
    </Connected>
  );
}
