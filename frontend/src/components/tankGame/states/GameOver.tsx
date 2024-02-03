import {
  useTankGamePodium,
  useTankGamePlayers,
  usePrepareTankGameClaim,
  useTankGameClaim,
} from "@/src/generated";
import { BaseError } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Trophy } from "lucide-react";
import { useTankNameFromId } from "../EventsStream";
import { useEffect } from "react";

export function GameOver({ gameAddress }: { gameAddress: `0x${string}` }) {
  let { toast } = useToast();

  const first = useTankGamePodium({
    // @ts-ignore
    address: gameAddress,
    args: [BigInt(0)],
  });
  const second = useTankGamePodium({
    // @ts-ignore
    address: gameAddress,
    args: [BigInt(1)],
  });
  const third = useTankGamePodium({
    // @ts-ignore
    address: gameAddress,
    args: [BigInt(2)],
  });
  const firstName = useTankNameFromId(gameAddress, first.data!);
  const secondName = useTankNameFromId(gameAddress, second.data!);
  const thirdName = useTankNameFromId(gameAddress, third.data!);
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    // @ts-ignore
    address: gameAddress,
  });
  let { data: claimConfig } = usePrepareTankGameClaim({
    // @ts-ignore
    address: gameAddress,
    args: [{ tankId: ownersTankId.data!, claimer: address! }],
    enabled:
      !!ownersTankId.data &&
      !!address &&
      (first.data === ownersTankId.data ||
        second.data === ownersTankId.data ||
        third.data === ownersTankId.data),
  });

  let { writeContract: claim, data:hash } = useTankGameClaim();
  const { data: receipt, error } = useWaitForTransactionReceipt({
    hash 
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
          <CardTitle>Game Over!</CardTitle>
          <CardDescription>Podium</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li>First: {firstName}</li>
            <li>Second: {secondName}</li>
            <li>Third: {thirdName}</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button disabled={!claim} onClick={() => claim?.(claimConfig!.request)}>
            <Trophy className="mr-2 h-4 w-4" />
            Claim Prize
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
