import { EventStream } from "../components/tankGame/EventsStream";
import { TankGame } from "../components/tankGame/TankGame";
import { Toaster } from "../components/ui/toaster";
import { Connected } from "../components/wagmi/Connected";
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
