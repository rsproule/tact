"use client";
import { useContractRead } from "wagmi";
import {
  tankGameABI,
  useTankGameGetSettings,
  useTankGameState,
  useITankGameGetSettings,
} from "../../generated";
import { LeaderBoard } from "../LeaderBoard";
import { Treaties } from "../treaties/Treaties";
import { HexBoard } from "./HexGameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { GameOver } from "./states/GameOver";
import { WaitingForPlayers } from "./states/WaitingForPlayers";
export function TankGame({ address }: { address: `0x${string}` }) {
  // @ts-ignore
  let gameState = useTankGameState({ watch: true, address: address });
  //@ts-ignore
  let settings = useTankGameGetSettings({ watch: true, address: address });
  return (
    <div>
      {gameState.data === 0 && (
        <WaitingForPlayers
          expectedPlayersCount={settings.data && settings.data!.playerCount}
          boardSize={settings.data && settings.data!.boardSize}
        />
      )}
      <HexBoard boardSize={settings.data && settings.data!.boardSize} />
      <Treaties />
      <div className="block justify-evenly py-5 md:flex">
        {gameState.data === 1 && <Timer />}
        {gameState.data === 2 && <GameOver />}
        {gameState.data !== 2 && <Donate />}
      </div>
      <LeaderBoard />
    </div>
  );
}
