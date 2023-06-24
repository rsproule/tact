"use client";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameJoin,
  useTankGameJoin,
  useTankGamePlayersCount,
  useTankGameSettings,
  useTankGameState,
} from "../../generated";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Board } from "./GameBoard";
import Timer from "./Timer";
import Donate from "./actions/Donate";
import { Card, CardHeader } from "../ui/card";
export function TankGame() {
  let gameState = useTankGameState({});
  let settings = useTankGameSettings();
  return (
    <div className={`w-full`}>
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
      <Donate />
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
  let { toast } = useToast();
  let numPlayers = useTankGamePlayersCount({
    watch: true,
  });
  const { write, data } = useTankGameJoin(config);
  useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: (error as BaseError)?.shortMessage,
      });
    },
    onSuccess: (s) => {
      toast({
        title: "Transaction Confirmed.",
        description: s.transactionHash,
      });
    },
  });
  return (
    <div>
      <div className="flex justify-center pb-3">
        <Card>
          <CardHeader>
            <p>
              Waiting for players:{" "}
              <span>{!!numPlayers.data && numPlayers.data.toString()} / </span>
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
          </CardHeader>
        </Card>
      </div>
      <Board boardSize={boardSize} />
    </div>
  );
}

function GameOver() {
  return <div></div>;
}
