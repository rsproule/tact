"use client";
import { useTankGameGetSettings, useTankGameState } from "../../generated";
import { LeaderBoard } from "../LeaderBoard";
import { HexBoard } from "./HexGameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { GameOver } from "./states/GameOver";
import { WaitingForPlayers } from "./states/WaitingForPlayers";
export function TankGame() {
  let gameState = useTankGameState({ watch: true });
  let settings = useTankGameGetSettings({ watch: true });
  return (
    <div>
      {gameState.data === 0 && (
        <WaitingForPlayers
          expectedPlayersCount={settings.data && settings.data!.playerCount}
          boardSize={settings.data && settings.data!.boardSize}
        />
      )}
      <HexBoard boardSize={settings.data && settings.data!.boardSize} />
      <div className="block justify-evenly py-5 md:flex">
        {gameState.data === 1 && <Timer />}
        {gameState.data === 2 && <GameOver />}
        {gameState.data !== 2 && <Donate />}
      </div>
      <LeaderBoard />
    </div>
  );
}
