import {
  usePrepareTankGameJoin,
  useTankGameJoin,
  useTankGamePlayersCount,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  useAccount,
  useBlockNumber,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "../../ui/button";
import { Card, CardHeader } from "../../ui/card";
import { Input } from "../../ui/input";
import { useToast } from "../../ui/use-toast";

const zero = [
  "0x0000000000000000000000000000000000000000000000000000000000000000",
] as readonly [`0x${string}`];

export function WaitingForPlayers({
  boardSize,
  expectedPlayersCount,
  gameAddress,
}: {
  boardSize: bigint | undefined;
  expectedPlayersCount: bigint | undefined;
  gameAddress: `0x${string}`;
}) {
  const [playerName, setPlayerName] = useState("");
  const { address } = useAccount();
  const proof = zero;
  let { data: joinConfig, refetch } = usePrepareTankGameJoin({
    // @ts-ignore
    address: gameAddress,
    args: [{ joiner: address!, proof: proof, playerName: playerName }],
    value: BigInt(0),
    enabled: !!playerName,
  });
  let { toast } = useToast();
  let { data: blockNumber } = useBlockNumber({ watch: true });
  let numPlayers = useTankGamePlayersCount({
    blockNumber: blockNumber,
    // @ts-ignore
    address: gameAddress,
  });
  const { writeContract: join, data: hash } = useTankGameJoin();
  const { data: receipt, error } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (receipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: receipt.transactionHash,
      });
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: error.message,
      });
    }
  }, [receipt, error, toast]);
  return (
    <div className="flex justify-center pb-3">
      <Card>
        <CardHeader>
          <p>
            Waiting for players:{" "}
            <span>{!!numPlayers.data && numPlayers.data.toString()} / </span>
            {!!expectedPlayersCount && expectedPlayersCount.toString()}
          </p>
          <p>
            Player Name:{" "}
            <Input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </p>

          <Button
            onClick={() => {
              join?.(joinConfig!.request);
              refetch?.();
              setPlayerName("");
            }}
            disabled={!join}
          >
            Join Game
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
