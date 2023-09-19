import {
  usePrepareNonAggressionPropose,
  useNonAggressionPropose,
} from "@/src/generated";
import { useState } from "react";
import { BaseError } from "viem";
import { useBlockNumber, useWaitForTransaction } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Card, CardHeader, CardContent } from "../ui/card";
import PlayerDropdown from "../tankGame/PlayerDropdown";

export default function CreateNonAggression({
  hookAddress,
}: {
  hookAddress: `0x${string}`;
}) {
  const { data: blockNumber } = useBlockNumber();
  const [targetTank, setTargetTank] = useState<bigint>(BigInt(0));
  const [expiry, setExpiry] = useState<bigint>(blockNumber!);
  const { config: createConfig } = usePrepareNonAggressionPropose({
    address: hookAddress,
    args: [targetTank, expiry],
    enabled: targetTank !== BigInt(0) && expiry !== BigInt(0),
  });

  const { write: create, data: createData } =
    useNonAggressionPropose(createConfig);
  useWaitForTransaction({
    hash: createData?.hash,
    enabled: !!createData,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: (error as BaseError)?.shortMessage,
      });
    },
    onSuccess: (s) => {
      setTargetTank(BigInt(0));
      setExpiry(BigInt(0));
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: s.transactionHash,
      });
    },
  });
  return (
    <Card>
      <CardHeader>Create Non-aggression pact</CardHeader>
      <CardContent>
        <div className="flex">
          <PlayerDropdown setTargetTank={setTargetTank} />
          <Input
            type="number"
            onChange={(e) => setExpiry(BigInt(e.target.value))}
            placeholder="Expiration blocknumber"
          />
          <Button disabled={!create} onClick={() => create?.()}>
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
