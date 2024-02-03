import { usePrepareBountyCreate, useBountyCreate } from "@/src/generated";
import { useEffect, useState } from "react";
import { parseEther, BaseError, Address } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader } from "../ui/card";
import PlayerDropdown from "../tankGame/PlayerDropdown";

export default function CreateBounty({
  hookAddress,
  gameAddress,
}: {
  hookAddress: Address;
  gameAddress: Address;
}) {
  const [targetTank, setTargetTank] = useState<string | undefined>();
  const [bounty, setBounty] = useState<string | undefined>();
  const { data: createBountyConfig } = usePrepareBountyCreate({
    address: hookAddress,
    args: [targetTank ? BigInt(targetTank) : BigInt(0)],
    value: bounty ? parseEther(bounty) : BigInt(0),
  });

  const { writeContract: create, data: createData } =
    useBountyCreate();
  const { data: receipt, error } = useWaitForTransactionReceipt({
    hash: createData
  });

  useEffect(() => {
    if (receipt) {
      setTargetTank(undefined);
      setBounty(undefined);
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
      <CardHeader>Create Bounty:</CardHeader>
      <CardContent>
        <div className="flex">
          <PlayerDropdown
            gameAddress={gameAddress}
            setTargetTank={setTargetTank}
            targetTank={targetTank}
          />
          <Input
            type="number"
            value={bounty}
            onChange={(e) => {
              try {
                parseEther(e.target.value);
                setBounty(e.target.value);
              } catch (e) { }
            }}
            placeholder="Bounty in ETH"
          />
          <Button disabled={!create} onClick={() => create?.(createBountyConfig!.request)}>
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
