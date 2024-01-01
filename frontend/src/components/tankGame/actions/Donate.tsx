import {
  usePrepareTankGameDonate,
  useTankGameDonate,
  useTankGamePrizePool,
} from "@/src/generated";
import { useState } from "react";
import { BaseError, formatEther, parseEther } from "viem";
import { useWaitForTransaction } from "wagmi";
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
  let { config } = usePrepareTankGameDonate({
    // @ts-ignore
    address: gameAddress,
    value: parseEther(amount as `${number}`),
    enabled: !!amount,
  });
  let { write: donate, data } = useTankGameDonate(config);
  useWaitForTransaction({
    hash: data?.hash,
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
              donate?.();
            }}
          >
            Donate ETH
          </Button>
        </div>
      </div>
    </div>
  );
}
