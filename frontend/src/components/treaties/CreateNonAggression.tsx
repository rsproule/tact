import {
  usePrepareNonAggressionPropose,
  useNonAggressionPropose,
  useTankGameGetSettings,
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
  const [targetTank, setTargetTank] = useState<string | undefined>();
  const [expiry, setExpiry] = useState<string | undefined>();
  const { config: createConfig } = usePrepareNonAggressionPropose({
    address: hookAddress,
    args: [
      targetTank ? BigInt(targetTank) : BigInt(0),
      expiry ? BigInt(expiry) : BigInt(0),
    ],
    enabled: !!targetTank && !!expiry,
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
      setTargetTank(undefined);
      setExpiry(undefined);
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
          <PlayerDropdown
            setTargetTank={setTargetTank}
            targetTank={targetTank}
          />
          <Input
            type="number"
            value={expiry}
            onChange={(e) => {
              try {
                BigInt(e.target.value);
                setExpiry(e.target.value);
              } catch (e) {}
            }}
            placeholder="Expiration epoch"
          />
          <Button
            disabled={!create}
            onClick={() => {
              create?.();
            }}
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
