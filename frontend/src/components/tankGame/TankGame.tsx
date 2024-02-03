"use client";
import { useAccount, useBlockNumber } from "wagmi";
import {
  gameViewAddress,
  useGameViewGetSettings,
  useTankGameState,
} from "../../generated";
import { LeaderBoard } from "../LeaderBoard";
import { Treaties } from "../treaties/Treaties";
import { HexBoard } from "./HexGameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { GameOver } from "./states/GameOver";
import { WaitingForPlayers } from "./states/WaitingForPlayers";
import { config } from "@/src/wagmi";

export function TankGame({ address }: { address: `0x${string}` }) {
  // @ts-ignore
  let gameState = useTankGameState({ watch: true, address: address });

  const { chain } = useAccount({config});
  const {data: blockNumber} = useBlockNumber({watch: true});
  let settings = useGameViewGetSettings({
    blockNumber,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  return (
    <div>
      {gameState.data === 0 && (
        <WaitingForPlayers
          expectedPlayersCount={settings.data && settings.data!.playerCount}
          boardSize={settings.data && settings.data!.boardSize}
          gameAddress={address}
        />
      )}
      <HexBoard
        boardSize={settings.data && settings.data!.boardSize}
        gameAddress={address}
      />
      <div className="block justify-evenly py-5 md:flex">
        {gameState.data !== 2 && <Timer address={address} />}
        {gameState.data === 2 && <GameOver gameAddress={address} />}
        {gameState.data !== 2 && <Donate gameAddress={address} />}
      </div>
      <Treaties gameAddress={address} />
      <div className="block justify-evenly py-5 md:flex">
      </div>
      <LeaderBoard gameAddress={address} />
    </div>
  );
}
