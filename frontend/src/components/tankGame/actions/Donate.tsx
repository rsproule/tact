import {
  usePrepareTankGameDonate,
  useTankGameDonate,
  useTankGamePrizePool,
} from "@/src/generated";
import { useState, useEffect } from "react";
import { BaseError, formatEther, parseEther } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useToast } from "../../ui/use-toast";

export default function Donate({
  gameAddress,
}: {
  gameAddress: `0x${string}`;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  let prizePool = useTankGamePrizePool({
    // @ts-ignore
    address: gameAddress,
    watch: true,
  });
  let { data: donateConfig } = usePrepareTankGameDonate({
    // @ts-ignore
    address: gameAddress,
    value: parseEther(amount as `${number}`),
    enabled: !!amount,
  });
  let { writeContract: donate, data: donateHash } = useTankGameDonate();
  const { data: donateReceipt, error: donateFailure } =
    useWaitForTransactionReceipt({
      hash: donateHash,
    });
  useEffect(() => {
    if (donateReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: donateReceipt.transactionHash,
      });
    }
    if (donateFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: donateFailure.message,
      });
    }
  }, [donateReceipt, donateFailure, toast]);
  return (
    <div className="flex justify-center pb-3">
      <div className="block justify-center pb-3">
        <>
          {prizePool.isSuccess ? formatEther(prizePool.data!) : "0"} ETH in the
          prize pool
        </>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value as `${number}`)}
          />
          <Button
            disabled={!donate}
            onClick={() => {
              donate?.(donateConfig!.request);
            }}
          >
            Donate ETH
          </Button>
        </div>
      </div>
    </div>
  );
}
