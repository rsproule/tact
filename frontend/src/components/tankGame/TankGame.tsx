"use client";
import { useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameJoin,
  useTankGameJoin,
  useTankGameSettings,
  useTankGameState,
} from "../../generated";
import { Button } from "../ui/button";
import { BaseError } from "viem";
import { Board } from "./GameBoard";
import { EventStream } from "./EventsStream";
export function TankGame() {
  let gameState = useTankGameState({
    watch: true,
  });

  let settings = useTankGameSettings();

  return (
    <div className={`w-full lg:w-3/4`}>
      {gameState.data === 0 && (
        <WaitingForPlayers
          boardSize={settings.data && settings.data!.boardSize}
        />
      )}
      {gameState.data === 1 && (
        <>
          <Board boardSize={settings.data && settings.data!.boardSize} />
        </>
      )}
      {gameState.data === 2 && <GameOver />}
      <EventStream />
    </div>
  );
}

function WaitingForPlayers({ boardSize }: { boardSize: bigint | undefined }) {
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
        disabled={!write}
      >
        Join Game
      </Button>
      {isLoading && <div>Sent to wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      <Board boardSize={boardSize} />
    </div>
  );
}

function GameOver() {
  return <div></div>;
}
