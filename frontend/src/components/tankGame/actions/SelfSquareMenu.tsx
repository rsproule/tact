import {
  usePrepareTankGameDrip,
  usePrepareTankGameUpgrade,
  useTankGameDrip,
  useTankGameUpgrade,
} from "@/src/generated";
import { Droplet, Rocket } from "lucide-react";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";

export default function SelfSquareMenu({
  ownersTank,
  open,
}: {
  ownersTank: bigint;
  open: boolean;
}) {
  let { toast } = useToast();
  let { config: upgradeConfig } = usePrepareTankGameUpgrade({
    args: [ownersTank],
    enabled: open && !!ownersTank,
  });
  const { write: upgrade, data: upgradeHash } =
    useTankGameUpgrade(upgradeConfig);
  useWaitForTransaction({
    hash: upgradeHash?.hash,
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
    args: [ownersTank],
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
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={!upgrade} onSelect={() => upgrade?.()}>
          <Rocket className="mr-2 h-4 w-4" />
          <span>Upgrade Range</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!drip} onSelect={() => drip?.()}>
          <Droplet className="mr-2 h-4 w-4" />
          <span>Claim APs</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
