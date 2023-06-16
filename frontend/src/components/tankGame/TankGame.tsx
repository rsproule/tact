"use client";
import { useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameJoin,
  useTankGameJoin,
  useTankGameState,
} from "../../generated";
import { Button } from "../ui/button";
import { BaseError } from "viem";
import { Board } from "./GameBoard";
export function TankGame() {
  let gameState = useTankGameState({
    watch: true,
  });

  return (
    <div className={`container mx-auto `}>
      {gameState.data === 0 && <WaitingForPlayers />}
      {gameState.data === 1 && <Board boardSize={10} />}
      {gameState.data === 2 && <GameOver />}
    </div>
  );
}

function WaitingForPlayers() {
  let { config } = usePrepareTankGameJoin({
    value: BigInt(0), // TODO: this is the buy in.
  });
  const { write, data, error, isLoading, isError } = useTankGameJoin(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });
  return (
    <div>
      <p>Waiting for players</p>

      <Button
        onClick={() => {
          write?.();
        }}
      >
        Join Game
      </Button>
      {isLoading && <div>Sent to wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      <div className={`container mx-auto `}>
        <Board boardSize={10} />
      </div>
    </div>
  );
}

function GameOver() {
  return <div></div>;
}
