import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
import { EventStream } from "../components/tankGame/EventsStream";
import { Toaster } from "../components/ui/toaster";
export default function HomePage() {
  return (
    <div className="grid container mx-auto border dark:bg-slate-800">
      <ConnectKitButton showBalance />

      <Connected>
        <TankGame />
        <EventStream />
        <Toaster />
      </Connected>
    </div>
  );
}
