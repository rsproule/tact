import { Connected } from "@/src/components/wagmi/Connected";
import { GamePage } from "./GamePage";

export default function Page({ params }: { params: { gameId: string } }) {
  return (
    <Connected>
      <GamePage gameAddress={params.gameId! as `0x${string}`} />
    </Connected>
  );
}
