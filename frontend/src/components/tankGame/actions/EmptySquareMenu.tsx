"use client";
import { usePrepareTankGameMove, useTankGameMove } from "@/src/generated";
import { Move } from "lucide-react";
import { useEffect } from "react";
import { DropdownMenuGroup, DropdownMenuItem } from "../../ui/dropdown-menu";
import { useToast } from "../../ui/use-toast";
import { useWaitForTransactionReceipt } from "wagmi";

export default function EmptySquareMenu({
  ownersTank,
  x,
  y,
  z,
  distance,
  open,
  gameAddress,
}: {
  ownersTank: bigint;
  x: number;
  y: number;
  z: number;
  distance: number | undefined;
  open: boolean;
  gameAddress: `0x${string}`;
}) {
  const { toast } = useToast();
  let { data: moveConfig } = usePrepareTankGameMove({
    // @ts-ignore
    address: gameAddress,
    args: [
      { tankId: ownersTank, to: { x: BigInt(x), y: BigInt(y), z: BigInt(z) } },
    ],
    enabled: open && !!ownersTank,
  });
  const { writeContract: move, data: moveHash } = useTankGameMove();
  const { data: moveReceipt, error: moveFailure } =
    useWaitForTransactionReceipt({
      hash: moveHash,
    });
  useEffect(() => {
    if (moveReceipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: moveReceipt.transactionHash,
      });
    }
    if (moveFailure) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: moveFailure.message,
      });
    }
  }, [moveReceipt, moveFailure, toast]);

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        disabled={!move}
        onSelect={() => move?.(moveConfig!.request)}
      >
        <Move className="mr-2 h-4 w-4" />
        <span>
          Move here ({y}, {x}, {z}) {distance ? `(costs ${distance} aps)` : ""}
        </span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
