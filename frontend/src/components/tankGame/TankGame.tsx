"use client";
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameJoin,
  useTankGameJoin,
  useTankGamePlayersCount,
  useTankGameSettings,
  useTankGameState,
} from "../../generated";
import { Button } from "../ui/button";
import { BaseError } from "viem";
import { Board } from "./GameBoard";
import { EventStream } from "./EventsStream";
export function TankGame() {
  let gameState = useTankGameState({});

  let settings = useTankGameSettings();

  return (
    <div className={`w-full lg:w-3/4`}>
      {gameState.data === 0 && (
        <WaitingForPlayers
          expectedPlayersCount={settings.data && settings.data!.playerCount}
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

function WaitingForPlayers({
  boardSize,
  expectedPlayersCount,
}: {
  boardSize: bigint | undefined;
  expectedPlayersCount: bigint | undefined;
}) {
  let { config, refetch } = usePrepareTankGameJoin();
  let numPlayers = useTankGamePlayersCount({
    watch: true,
  });
  const { write, data, error, isLoading, isError } = useTankGameJoin(config);
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });
  return (
    <div>
      <p>
        Waiting for players:
        {!!numPlayers.data && numPlayers.data.toString()} /{" "}
        {!!expectedPlayersCount && expectedPlayersCount.toString()}
      </p>
      <Button
        onClick={() => {
          write?.();
          refetch?.();
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
