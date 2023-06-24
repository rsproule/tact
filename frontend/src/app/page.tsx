import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
import { EventStream } from "../components/tankGame/EventsStream";
import { Toaster } from "../components/ui/toaster";
import Rules from "../components/tankGame/Rules";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <ConnectKitButton showBalance />
      <div className="flex justify-center">
        <h1 className="text-4xl">Tank Turn Tactics (alpha 0.0.1)</h1>
      </div>
      <Rules />
      <Connected>
        <TankGame />
        <EventStream />
        <Toaster />
      </Connected>
    </div>
  );
}
