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
import { TANK_MAPPING } from "../EventsStream";

export function GameOver() {
  let { toast } = useToast();

  const first = useTankGamePodium({
    args: [BigInt(0)],
  });
  const second = useTankGamePodium({
    args: [BigInt(1)],
  });
  const third = useTankGamePodium({
    args: [BigInt(2)],
  });
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  let { config } = usePrepareTankGameClaim({
    args: [ownersTankId.data!, address!],
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
    <div>
      <h1 className="text-xl">Game Over</h1>
      <h1 className="text-lg">Podium</h1>
      <ul>
        <li>First: {!!first.data && TANK_MAPPING[Number(first.data!)]}</li>
        <li>Second: {!!second.data && TANK_MAPPING[Number(second.data!)]}</li>
        <li>Third: {!!third.data && TANK_MAPPING[Number(third.data!)]}</li>
      </ul>
      <Button disabled={!claim} onClick={() => claim?.()}>
        Claim Prize
      </Button>
    </div>
  );
}
