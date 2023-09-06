"use client";
import { usePrepareTankGameMove, useTankGameMove } from "@/src/generated";
import { Move } from "lucide-react";
import { BaseError } from "viem";
import { useWaitForTransaction } from "wagmi";
import { DropdownMenuGroup, DropdownMenuItem } from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";

export default function EmptySquareMenu({
  ownersTank,
  x,
  y,
  z,
  distance,
  open,
}: {
  ownersTank: bigint;
  x: number;
  y: number;
  z: number;
  distance: number | undefined;
  open: boolean;
}) {
  const { toast } = useToast();
  let { config } = usePrepareTankGameMove({
    args: [ownersTank, { x: BigInt(x), y: BigInt(y), z: BigInt(z) }],
    enabled: open && !!ownersTank,
  });
  const { write: move, data } = useTankGameMove(config);
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
    // <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuItem disabled={!move} onSelect={() => move?.()}>
        <Move className="mr-2 h-4 w-4" />
        <span>
          Move here ({y}, {x}, {z}) {distance ? `(costs ${distance} aps)` : ""}
        </span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    // </DropdownMenuContent>
  );
}
