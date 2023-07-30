import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
import { EventStream } from "../components/tankGame/EventsStream";
import { Toaster } from "../components/ui/toaster";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <Connected>
        <TankGame />
        <EventStream />
        <Toaster />
      </Connected>
    </div>
  );
}
