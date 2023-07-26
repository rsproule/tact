import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
import { EventStream } from "../components/tankGame/EventsStream";
import { Toaster } from "../components/ui/toaster";
import Rules from "../components/tankGame/Rules";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <div className="flex justify-center">
        <h1 className="text-4xl">Tact</h1>
      </div>
      <Connected>
        <TankGame />
        <EventStream />
        <Toaster />
      </Connected>
    </div>
  );
}
