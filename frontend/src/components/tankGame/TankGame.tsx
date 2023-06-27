"use client";
import { useTankGameSettings, useTankGameState } from "../../generated";
import { Board } from "./GameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { GameOver } from "./states/GameOver";
import { WaitingForPlayers } from "./states/WaitingForPlayers";
export function TankGame() {
  let gameState = useTankGameState();
  let settings = useTankGameSettings();
  return (
    <div className={`w-full`}>
      <a
        className="text-blue-600 visited:text-purple-600"
        href="https://goerli.etherscan.io/address/0x1D738bb3c3D594E248Fdb5234b7Af7a2Ecb7B64D"
      >
        View Contract on Block Explorer
      </a>
      {gameState.data === 0 && (
        <WaitingForPlayers
          expectedPlayersCount={settings.data && settings.data!.playerCount}
          boardSize={settings.data && settings.data!.boardSize}
        />
      )}
      {gameState.data === 1 && (
        <>
          <Timer />
          <Board boardSize={settings.data && settings.data!.boardSize} />
        </>
      )}
      {gameState.data === 2 && <GameOver />}
      {gameState.data !== 2 && <Donate />}
    </div>
  );
}
