import {
  usePrepareTankGameDrip,
  usePrepareTankGameUpgrade,
  useTankGameDrip,
  useTankGameGetUpgradeCost,
  useTankGameUpgrade,
} from "@/src/generated";
import { Droplet, Rocket } from "lucide-react";
import { useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { DropdownMenuGroup, DropdownMenuItem } from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";

export default function SelfSquareMenu({
  ownersTank,
  open,
  gameAddress,
}: {
  ownersTank: bigint;
  open: boolean;
  gameAddress: `0x${string}`;
}) {
  let { toast } = useToast();
  let { data: upgradeCost } = useTankGameGetUpgradeCost({
    // @ts-ignore
    address: gameAddress,
    args: [ownersTank],
  });
  let { data: upgradeConfig } = usePrepareTankGameUpgrade({
    // @ts-ignore
    address: gameAddress,
    args: [{ tankId: ownersTank }],
    enabled: open && !!ownersTank,
  });
  const { writeContract: upgrade, data: upgradeHash } = useTankGameUpgrade();
  const { data: upgradeReceipt, error: upgradeFailure } =
    useWaitForTransactionReceipt({
      hash: upgradeHash,
    });
  useEffect(() => {
    if (upgradeReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: upgradeReceipt.transactionHash,
      });
    }
    if (upgradeFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: upgradeFailure.message,
      });
    }
  }, [upgradeReceipt, upgradeFailure, toast]);

  let { data: dripConfig } = usePrepareTankGameDrip({
    // @ts-ignore
    address: gameAddress,
    args: [{ tankId: ownersTank }],
    enabled: open && !!ownersTank,
  });
  const { writeContract: drip, data: dripHash } = useTankGameDrip();
  const { data: dripReceipt, error: dripFailure } =
    useWaitForTransactionReceipt({
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
      <DropdownMenuItem
        disabled={!upgrade}
        onSelect={() => upgrade?.(upgradeConfig!.request)}
      >
        <Rocket className="mr-2 h-4 w-4" />
        <span>
          Upgrade Range ({upgradeCost ? upgradeCost.toString() : "..."} APs)
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={!drip}
        onSelect={() => drip?.(dripConfig!.request)}
      >
        <Droplet className="mr-2 h-4 w-4" />
        <span>Claim APs</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
