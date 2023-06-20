import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
import { EventStream } from "../components/tankGame/EventsStream";
export function Page() {
  return (
    <div className="grid container mx-auto border">
        <ConnectKitButton showBalance />

      <Connected>
        <TankGame />
        <EventStream />
      </Connected>
    </div>
  );
}

export default Page;
