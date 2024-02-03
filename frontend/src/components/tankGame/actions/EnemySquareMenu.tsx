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
  Crosshair,
  Droplet,
  GiftIcon,
  HeartHandshake,
  SkullIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  useWaitForTransactionReceipt,
  useWatchPendingTransactions,
} from "wagmi";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { useToast } from "../../ui/use-toast";
import { config } from "@/src/wagmi";

export default function EnemySquareMenu({
  ownersTank,
  enemyTank,
  open,
  gameAddress,
}: {
  ownersTank: bigint | undefined;
  enemyTank: bigint | undefined;
  open: boolean;
  gameAddress: `0x${string}`;
}) {
  const [multiplier, setMultiplier] = useState(1);
  const { toast } = useToast();
  let { data: shootConfig } = usePrepareTankGameShoot({
    // @ts-ignore
    address: gameAddress,
    args: [
      {
        fromId: ownersTank!,
        toId: enemyTank!,
        shots: BigInt(multiplier ? multiplier : 1),
      },
    ],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { writeContract: shoot, data: shootHash } = useTankGameShoot();
  const { data: shootReceipt, error: shootFailure } = useWaitForTransactionReceipt({
    hash: shootHash,
  });
  useEffect(() => {
    if (shootReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: shootReceipt.transactionHash,
      });
    }
    if (shootFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: shootFailure.message,
      });
    }
  }, [shootReceipt, shootFailure, toast]);

  let { data: giftHeartConfig } = usePrepareTankGameGive({
    // @ts-ignore
    address: gameAddress,
    args: [
      {
        fromId: ownersTank!,
        toId: enemyTank!,
        hearts: BigInt(multiplier ? multiplier : 1),
        aps: BigInt(0),
      },
    ],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { writeContract: giveHeart, data: giveHeartHash } = useTankGameGive();
  const { data: giveHeartReceipt, error: giveHeartFailure } = useWaitForTransactionReceipt({
    hash: giveHeartHash,
  });
  useEffect(() => {
    if (giveHeartReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: giveHeartReceipt.transactionHash,
      });
    }
    if (giveHeartFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: giveHeartFailure.message,
      });
    }
  }, [giveHeartReceipt, giveHeartFailure, toast]);

  let { data: giveAPConfig } = usePrepareTankGameGive({
    // @ts-ignore
    address: gameAddress,
    args: [
      {
        fromId: ownersTank!,
        toId: enemyTank!,
        hearts: BigInt(0),
        aps: BigInt(multiplier ? multiplier : 1),
      },
    ],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { writeContract: giveAp, data: giveAPHash } = useTankGameGive();
  const { data: giveAPReceipt, error: giveAPFailure } =
    useWaitForTransactionReceipt({
      hash: giveAPHash,
    });
  useEffect(() => {
    if (giveAPReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: giveAPReceipt.transactionHash,
      });
    }
    if (giveAPFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: giveAPFailure.message,
      });
    }
  }, [giveAPReceipt, giveAPFailure, toast]);

  let { data: curseConfig } = usePrepareTankGameVote({
    // @ts-ignore
    address: gameAddress,
    args: [{ voter: ownersTank!, cursed: enemyTank! }],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { writeContract: curse, data: curseHash } = useTankGameVote();
  const { data: curseReceipt, error: curseFailure } = useWaitForTransactionReceipt({
    hash: curseHash,
  });
  useEffect(() => {
    if (curseReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: curseReceipt.transactionHash,
      });
    }
    if (curseFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: curseFailure.message,
      });
    }
  }, [curseReceipt, curseFailure, toast]);

  let { data: dripConfig } = usePrepareTankGameDrip({
    // @ts-ignore
    address: gameAddress,
    args: [{ tankId: enemyTank! }],
    enabled: open && !!ownersTank,
  });
  const { writeContract: drip, data: dripHash } = useTankGameDrip();
  const { data: dripReceipt, error: dripFailure } = useWaitForTransactionReceipt({
    hash: dripHash,
  });
  useEffect(() => {
    if (dripReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: dripReceipt.transactionHash,
      });
    }
    if (dripFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: dripFailure.message,
      });
    }
  }, [dripReceipt, dripFailure, toast]);

  return (
    <DropdownMenuGroup>
      <span>Multiplier</span>
      <Input
        // value={multiplier}
        defaultValue={1}
        onChange={(e) => {
          try {
            let parsedValue = parseInt(e.target.value);
            setMultiplier(isNaN(parsedValue) ? 1 : parsedValue);
          } catch (e) {}
        }}
      />
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={!shoot}
        onSelect={() => shoot?.(shootConfig!.request)}
      >
        <Crosshair className="mr-2 h-4 w-4" />
        <span>Shoot</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={!giveHeart}
        onSelect={() => giveHeart?.(giftHeartConfig!.request)}
      >
        <HeartHandshake className="mr-2 h-4 w-4" />
        <span>Give heart</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!giveAp}
        onSelect={() => giveAp?.(giveAPConfig!.request)}
      >
        <GiftIcon className="mr-2 h-4 w-4" />
        <span>Give AP</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!curse}
        onSelect={() => curse?.(curseConfig!.request)}
      >
        <SkullIcon className="mr-2 h-4 w-4" />
        <span>Curse</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!drip}
        onSelect={() => drip?.(dripConfig!.request)}
      >
        <Droplet className="mr-2 h-4 w-4" />
        <span>Force Claim APs</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
