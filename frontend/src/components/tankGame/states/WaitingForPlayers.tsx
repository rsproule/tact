import {
  usePrepareTankGameJoin,
  useTankGamePlayersCount,
  useTankGameJoin,
} from "@/src/generated";
import { BaseError } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";
import { Button } from "../../ui/button";
import { Card, CardHeader } from "../../ui/card";
import { useToast } from "../../ui/use-toast";
import * as tree from "public/tree.json";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

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
  const merkleTree = StandardMerkleTree.load(tree as any);
  const { address } = useAccount();
  const value = tree.values.find((x) => x.value[0] === address);
  const proof = value
    ? merkleTree
        .getProof(value.value)
        .map((x) => Object.freeze(x) as `0x${string}`)
    : zero;
  let { config, refetch } = usePrepareTankGameJoin({
    // @ts-ignore
    address: gameAddress,
    args: [
      { joiner: address!, proof: proof, playerName: value?.value[1] ?? "" },
    ],
    value: BigInt(0),
  });
  let { toast } = useToast();
  let numPlayers = useTankGamePlayersCount({
    watch: true,
    // @ts-ignore
    address: gameAddress,
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
