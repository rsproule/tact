import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import { Connected } from "../components/wagmi/Connected";
import { TankGame } from "../components/tankGame/TankGame";
export function Page() {
  return (
    <>
      <ConnectKitButton />

      <Connected>
        <TankGame />
      </Connected>
    </>
  );
}

export default Page;
