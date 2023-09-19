import {
  useTankGamePlayers,
  bountyABI,
  usePrepareTankGameAddHooks,
  useTankGameAddHooks,
  usePrepareBountyWithdraw,
  useBountyWithdraw,
} from "@/src/generated";
import { useState, useEffect } from "react";
import { BaseError, formatEther } from "viem";
import {
  useAccount,
  useBlockNumber,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { toTankName } from "../tankGame/EventsStream";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Card, CardHeader, CardContent } from "../ui/card";

export default function Bounty({
  hookAddress,
  tankId,
}: {
  tankId: bigint;
  hookAddress: `0x${string}`;
}) {
  const { address } = useAccount();
  const ownerTank = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [bounties, setBounties] = useState<any>();
  const [bountiesWon, setBountiesWon] = useState<any>();
  const [withdraws, setWithdraws] = useState<any>();
  useEffect(() => {
    const getLogs = async () => {
      const publicClient = getPublicClient();
      const filter = await publicClient.createContractEventFilter({
        abi: bountyABI,
        strict: true,
        fromBlock: BigInt(0),
        address: hookAddress,
      });
      const bounties = await publicClient.getFilterLogs({
        filter,
      });
      const postedBounties = bounties.filter(
        (bounty: any) => bounty.eventName === "BountyPosted"
      );
      const uniqueBounties = postedBounties.reduce((acc: any, current: any) => {
        const x = acc.find(
          (item: any) =>
            item.address === current.address &&
            item.args.tankId === current.args.tankId &&
            item.args.target === current.args.target
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc.map((item: any) =>
            item.address === current.address &&
            item.args.tankId === current.args.tankId &&
            item.args.target === current.args.target &&
            item.args.amount > current.args.amount
              ? current
              : item
          );
        }
      }, []);

      setBounties(uniqueBounties);
      const wonBounties = bounties.filter(
        (bounty: any) => bounty.eventName === "BountyWon"
      );
      setBountiesWon(wonBounties);
      const withdrawLogs = bounties.filter(
        (bounty: any) => bounty.eventName === "Withdraw"
      );
      setWithdraws(withdrawLogs);
    };
    getLogs();
  }, [hookAddress, blockNumber]);
  const { config: addHooksConfig } = usePrepareTankGameAddHooks({
    args: [ownerTank.data!, hookAddress],
    enabled: !!ownerTank,
  });
  const { write: addHook, data: addHookData } =
    useTankGameAddHooks(addHooksConfig);
  useWaitForTransaction({
    hash: addHookData?.hash,
    enabled: !!addHookData,
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
  const { config: withdrawConfig } = usePrepareBountyWithdraw({
    args: [ownerTank.data!, address!],
    enabled: !!ownerTank,
    address: hookAddress,
  });
  const { write: withdraw, data: withdrawData } =
    useBountyWithdraw(withdrawConfig);
  useWaitForTransaction({
    hash: withdrawData?.hash,
    enabled: !!withdrawData,
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
    bounties &&
    bounties.length !== 0 && (
      <Card>
        <CardHeader>
          <div className="text-xl">Bounties posted by {toTankName(tankId)}</div>
        </CardHeader>
        <CardContent>
          {bounties?.map((bounty: any, i: number) => {
            return (
              <div key={i} className="flex justify-between border">
                <div>Target: {toTankName(bounty.args.target)}</div>
                <div>Proposer: {toTankName(bounty.args.tankId)}</div>
                <div>
                  Bounty amount: {formatEther(bounty.args.amount)} Ether
                </div>
                {bountiesWon?.find(
                  (wonBounty: any) =>
                    wonBounty.args.bountyId === bounty.args.bountyId
                ) ? (
                  <div>
                    {bountiesWon?.find(
                      (wonBounty: any) =>
                        wonBounty.args.winner === ownerTank.data
                    ) ? (
                      !withdraws?.find(
                        (withdraw: any) =>
                          withdraw.args.bountyId === bounty.args.bountyId
                      ) ? (
                        "Claimed by " +
                        toTankName(
                          bountiesWon?.filter(
                            (withdraw: any) =>
                              withdraw.args.bountyId === bounty.args.bountyId
                          )[0].args.winner
                        )
                      ) : (
                        <Button
                          disabled={!withdraw}
                          onClick={() => withdraw?.()}
                        >
                          Claim
                        </Button>
                      )
                    ) : (
                      "Has been won"
                    )}
                  </div>
                ) : (
                  <Button disabled={!addHook} onClick={() => addHook?.()}>
                    Accept
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    )
  );
}
