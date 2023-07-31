import {
  usePrepareTankGameGive,
  usePrepareTankGameShoot,
  useTankGameGive,
  useTankGameShoot,
} from "@/src/generated";
import { Crosshair, GiftIcon, HeartHandshake } from "lucide-react";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";

export default function EnemySquareMenu({
  ownersTank,
  enemyTank,
  open,
}: {
  ownersTank: bigint | undefined;
  enemyTank: bigint | undefined;
  open: boolean;
}) {
  const { toast } = useToast();
  let { config: shootConfig } = usePrepareTankGameShoot({
    args: [ownersTank!, enemyTank!, BigInt(1)],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: shoot, data: shootHash } = useTankGameShoot(shootConfig);
  useWaitForTransaction({
    hash: shootHash?.hash,
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

  let { config: giftHeartConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(1), BigInt(0)],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: giveHeart, data: giveHeartHash } =
    useTankGameGive(giftHeartConfig);
  useWaitForTransaction({
    hash: giveHeartHash?.hash,
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
  let { config: giveAPConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(0), BigInt(1)],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: giveAp, data: giveHash } = useTankGameGive(giveAPConfig);
  useWaitForTransaction({
    hash: giveHash?.hash,
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
    <DropdownMenuGroup>
      <DropdownMenuItem disabled={!shoot} onSelect={() => shoot?.()}>
        <Crosshair className="mr-2 h-4 w-4" />
        <span>Shoot</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={!giveHeart} onSelect={() => giveHeart?.()}>
        <HeartHandshake className="mr-2 h-4 w-4" />
        <span>Give heart</span>
      </DropdownMenuItem>
      <DropdownMenuItem disabled={!giveAp} onSelect={() => giveAp?.()}>
        <GiftIcon className="mr-2 h-4 w-4" />
        <span>Give AP</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
