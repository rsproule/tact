import {
  useTankGamePodium,
  useTankGamePlayers,
  usePrepareTankGameClaim,
  useTankGameClaim,
} from "@/src/generated";
import { BaseError } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";
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
import { toTankName } from "../EventsStream";

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
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
    // @ts-ignore
    address: gameAddress,
  });
  let { config } = usePrepareTankGameClaim({
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

  let { write: claim, data } = useTankGameClaim(config);
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
          <CardTitle>Game Over!</CardTitle>
          <CardDescription>Podium</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li>First: {!!first.data && toTankName(first.data!)}</li>
            <li>Second: {!!second.data && toTankName(second.data!)}</li>
            <li>Third: {!!third.data && toTankName(third.data!)}</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button disabled={!claim} onClick={() => claim?.()}>
            <Trophy className="mr-2 h-4 w-4" />
            Claim Prize
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
