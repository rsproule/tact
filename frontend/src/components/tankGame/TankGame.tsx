"use client";
import { useITankGameGetSettings, useTankGameSettings, useTankGameState } from "../../generated";
// import { Board } from "./GameBoard";
import { HexBoard } from "./HexGameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { GameOver } from "./states/GameOver";
import { WaitingForPlayers } from "./states/WaitingForPlayers";
export function TankGame() {
  let gameState = useTankGameState();
  console.log("gameState", gameState)
  // let settings = useTankGameSettings();
  let settings = useITankGameGetSettings()
  return (
    <div className={`w-full`}>
      <a
        className="text-blue-600 visited:text-purple-600"
        href="https://goerli.etherscan.io/address/0x0a8628a32f0AC3A208B8CEf032B38fF08bB140D7"
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
          <HexBoard boardSize={settings.data && settings.data!.boardSize} />
        </>
      )}
      <HexBoard boardSize={settings.data && settings.data!.boardSize} />
      {/* {gameState.data === 2 && <GameOver />}
      {gameState.data !== 2 && <Donate />} */}
    </div>
  );
}
