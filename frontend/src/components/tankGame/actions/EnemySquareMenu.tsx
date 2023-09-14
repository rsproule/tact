import {
  usePrepareTankGameDrip,
  usePrepareTankGameGive,
  usePrepareTankGameShoot,
  usePrepareTankGameVote,
  useTankGameDrip,
  useTankGameGive,
  useTankGameShoot,
  useTankGameVote,
} from "@/src/generated";
import {
  Droplet,
  Crosshair,
  GiftIcon,
  HeartHandshake,
  SkullIcon,
} from "lucide-react";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";
import { Input } from "../../ui/input";
import { useState } from "react";

export default function EnemySquareMenu({
  ownersTank,
  enemyTank,
  open,
}: {
  ownersTank: bigint | undefined;
  enemyTank: bigint | undefined;
  open: boolean;
}) {
  const [multiplier, setMultiplier] = useState("1");
  const { toast } = useToast();
  let { config: shootConfig } = usePrepareTankGameShoot({
    args: [
      ownersTank!,
      enemyTank!,
      BigInt(multiplier ? parseInt(multiplier) : 1),
    ],
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
    args: [
      ownersTank!,
      enemyTank!,
      BigInt(multiplier ? parseInt(multiplier) : 1),
      BigInt(0),
    ],
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
    args: [
      ownersTank!,
      enemyTank!,
      BigInt(0),
      BigInt(multiplier ? parseInt(multiplier) : 1),
    ],
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
  let { config: curseConfig } = usePrepareTankGameVote({
    args: [ownersTank!, enemyTank!],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: curse, data: curseHash } = useTankGameVote(curseConfig);
  useWaitForTransaction({
    hash: curseHash?.hash,
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

  let { config: dripConfig } = usePrepareTankGameDrip({
    args: [enemyTank!],
    enabled: open && !!ownersTank,
  });
  const { write: drip, data: dripHash } = useTankGameDrip(dripConfig);
  useWaitForTransaction({
    hash: dripHash?.hash,
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
      <span>Multiplier</span>
      <Input
        value={multiplier}
        onChange={(e) => setMultiplier(e.target.value)}
      />
      <DropdownMenuSeparator />
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
      <DropdownMenuItem disabled={!curse} onSelect={() => curse?.()}>
        <SkullIcon className="mr-2 h-4 w-4" />
        <span>Curse</span>
      </DropdownMenuItem>
      <DropdownMenuItem disabled={!drip} onSelect={() => drip?.()}>
        <Droplet className="mr-2 h-4 w-4" />
        <span>Force Claim APs</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
