import { usePrepareBountyCreate, useBountyCreate } from "@/src/generated";
import { useState } from "react";
import { parseEther, BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader } from "../ui/card";
import PlayerDropdown from "../tankGame/PlayerDropdown";

export default function CreateBounty({
  hookAddress,
}: {
  hookAddress: `0x${string}`;
}) {
  const [targetTank, setTargetTank] = useState<string | undefined>();
  const [bounty, setBounty] = useState<string | undefined>();
  const { config: createBountyConfig } = usePrepareBountyCreate({
    address: hookAddress,
    args: [targetTank ? BigInt(targetTank) : BigInt(0)],
    value: bounty ? parseEther(bounty) : BigInt(0),
    enabled: !!targetTank && !!bounty,
  });

  const { write: create, data: createData } =
    useBountyCreate(createBountyConfig);
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
      setBounty(undefined);
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: s.transactionHash,
      });
    },
  });
  return (
    <Card>
      <CardHeader>Create Bounty:</CardHeader>
      <CardContent>
        <div className="flex">
          <PlayerDropdown
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
              } catch (e) {}
            }}
            placeholder="Bounty in ETH"
          />
          <Button disabled={!create} onClick={() => create?.()}>
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
