import { EventStream } from "../components/tankGame/EventsStream";
import { TankGame } from "../components/tankGame/TankGame";
import { Toaster } from "../components/ui/toaster";
import { Connected } from "../components/wagmi/Connected";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <Connected>
        <TankGame address="0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743" />
        <EventStream address="0x5Df10751352b7bA7b0Cea02c12d1a0b101F7b743" />
        <Toaster />
      </Connected>
    </div>
  );
}
