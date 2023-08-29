import {
  usePrepareTankGameJoin,
  useTankGamePlayersCount,
  useTankGameJoin,
} from "@/src/generated";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import { Button } from "../../ui/button";
import { Card, CardHeader } from "../../ui/card";
import { useToast } from "../../ui/use-toast";
import { HexBoard } from "../HexGameBoard";

export function WaitingForPlayers({
  boardSize,
  expectedPlayersCount,
}: {
  boardSize: bigint | undefined;
  expectedPlayersCount: bigint | undefined;
}) {
  const zero = [
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ] as readonly [`0x${string}`];
  let { config, refetch } = usePrepareTankGameJoin({
    args: [zero, "name"],
    value: BigInt(0),
  });
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
        variant: "success",
        title: "Transaction Confirmed.",
        description: s.transactionHash,
      });
    },
  });
  return (
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
  );
}
