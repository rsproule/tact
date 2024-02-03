import {
  useNonAggressionPropose,
  usePrepareNonAggressionPropose,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { Address, BaseError } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import PlayerDropdown from "../tankGame/PlayerDropdown";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

export default function CreateNonAggression({
  hookAddress,
  gameAddress,
}: {
  hookAddress: Address;
  gameAddress: Address;
}) {
  const [targetTank, setTargetTank] = useState<string | undefined>();
  const [expiry, setExpiry] = useState<string | undefined>();
  const { data: createConfig } = usePrepareNonAggressionPropose({
    address: hookAddress,
    args: [
      targetTank ? BigInt(targetTank) : BigInt(0),
      expiry ? BigInt(expiry) : BigInt(0),
    ],
  });

  const { writeContract: create, data: createData } = useNonAggressionPropose();
  const { data: receipt, error } = useWaitForTransactionReceipt({
    hash: createData,
  });

  useEffect(() => {
    if (receipt) {
      setTargetTank(undefined);
      setExpiry(undefined);
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
        description: (error as BaseError)?.shortMessage,
      });
    }
  }, [receipt, error]);
  return (
    <Card>
      <CardHeader>Create Non-aggression pact</CardHeader>
      <CardContent>
        <div className="flex">
          <PlayerDropdown
            gameAddress={gameAddress}
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
              create?.(createConfig!.request);
            }}
          >
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
