import { usePrepareBountyCreate, useBountyCreate } from "@/src/generated";
import { useState } from "react";
import { parseEther, BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function CreateBounty({
  hookAddress,
}: {
  hookAddress: `0x${string}`;
}) {
  const [targetTank, setTargetTank] = useState<bigint>(BigInt(0));
  const [bounty, setBounty] = useState<string>("");
  const { config: createBountyConfig } = usePrepareBountyCreate({
    address: hookAddress,
    args: [targetTank],
    value: parseEther(bounty),
    enabled: targetTank !== BigInt(0),
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
          <Input
            type="number"
            onChange={(e) => setTargetTank(BigInt(e.target.value))}
            placeholder="target"
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
            placeholder="bounty"
          />
          <Button disabled={!create} onClick={() => create?.()}>
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
