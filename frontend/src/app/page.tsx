import { EventStream } from "../components/tankGame/EventsStream";
import { TankGame } from "../components/tankGame/TankGame";
import { Toaster } from "../components/ui/toaster";
import { Connected } from "../components/wagmi/Connected";
export default function HomePage() {
  return (
    <div className="grid container mx-auto p-4">
      <Connected>
        <TankGame address="0x5947e5654E63aBB5Be710b9D7e7eB87AE884Fa42" />
        <EventStream address="0x5947e5654E63aBB5Be710b9D7e7eB87AE884Fa42" />
        <Toaster />
      </Connected>
    </div>
  );
}
