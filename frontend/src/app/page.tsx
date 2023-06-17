import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
export function Page() {
  return (
    <div className="grid container mx-auto border">
        <ConnectKitButton showBalance />

      <Connected>
        <TankGame />
      </Connected>
    </div>
  );
}

export default Page;
