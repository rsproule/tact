import {
  useTankGamePlayers,
  bountyABI,
  usePrepareTankGameAddHooks,
  useTankGameAddHooks,
  usePrepareBountyWithdraw,
  useBountyWithdraw,
} from "@/src/generated";
import { useState, useEffect } from "react";
import { Address, BaseError, formatEther } from "viem";
import { useAccount, useBlockNumber, useWaitForTransaction } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import {
  getTankNameFromJoinIndex,
  useTankNameFromId,
} from "../tankGame/EventsStream";
import { toast } from "../ui/use-toast";
import { Card, CardHeader, CardContent } from "../ui/card";

export default function Bounty({
  hookAddress,
  gameAddress,
  tankId,
  hideNotMine,
  addedHooks,
}: {
  tankId: bigint;
  hookAddress: `0x${string}`;
  gameAddress: `0x${string}`;
  hideNotMine: boolean;
  addedHooks: any;
}) {
  const tankName = useTankNameFromId(gameAddress, tankId);
  console.log({ tankName });
  console.log({ tankId });
  const { address } = useAccount();
  const ownerTank = useTankGamePlayers({
    // @ts-ignore
    address: gameAddress,
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
    bounties.filter((t: any) => {
      if (hideNotMine) {
        return (
          t.args.tankId === ownerTank.data! ||
          t.args.victim === ownerTank.data! ||
          t.args.winner === ownerTank.data! ||
          t.args.target === ownerTank.data!
        );
      }
      return true;
    }).length !== 0 && (
      <Card>
        <CardHeader>
          <div className="text-xl">💰 {tankName} Bounties</div>
        </CardHeader>
        <CardContent>
          {bounties
            ?.filter((t: any) => {
              if (hideNotMine) {
                return (
                  t.args.tankId === ownerTank.data! ||
                  t.args.victim === ownerTank.data! ||
                  t.args.winner === ownerTank.data! ||
                  t.args.target === ownerTank.data!
                );
              }
              return true;
            })
            .map((bounty: any, i: number) => {
              return (
                <BountyCard
                  key={i}
                  bounty={bounty}
                  bountiesWon={bountiesWon}
                  withdraws={withdraws}
                  ownerTank={ownerTank}
                  addHook={addHook}
                  withdraw={withdraw}
                  addedHooks={addedHooks}
                  hookAddress={hookAddress}
                  gameAddress={gameAddress}
                />
              );
            })}
        </CardContent>
      </Card>
    )
  );
}

function BountyCard({
  bounty,
  bountiesWon,
  withdraws,
  ownerTank,
  addHook,
  withdraw,
  addedHooks,
  hookAddress,
  gameAddress,
}: {
  bounty: any;
  bountiesWon: any;
  withdraws: any;
  ownerTank: any;
  addHook: any;
  withdraw: any;
  addedHooks: any;
  hookAddress: Address;
  gameAddress: Address;
}) {
  const proposerName = useTankNameFromId(gameAddress, bounty.args.tankId);
  const targetName = useTankNameFromId(gameAddress, bounty.args.target);
  return (
    <div className="flex justify-between border">
      <div>Proposer: {proposerName}</div>
      <div>Target: {targetName}</div>
      <div>Bounty amount: {formatEther(bounty.args.amount)} Ether</div>
      {bountiesWon?.find(
        (wonBounty: any) => wonBounty.args.bountyId === bounty.args.bountyId
      ) ? (
        <div>
          {bountiesWon?.find(
            (wonBounty: any) => wonBounty.args.winner === ownerTank.data
          ) ? (
            !withdraws?.find(
              (withdraw: any) => withdraw.args.bountyId === bounty.args.bountyId
            ) ? (
              <div>
                {"Claimed by "}
                <TankName
                  key={bounty.args.bountyId}
                  tankId={
                    bountiesWon?.filter(
                      (withdraw: any) =>
                        withdraw.args.bountyId === bounty.args.bountyId
                    )[0].args.winner
                  }
                  gameAddress={gameAddress}
                />
              </div>
            ) : (
              <button
                className="bg-white text-black px-2 disabled:opacity-50 enabled:cursor-pointer"
                disabled={!withdraw}
                onClick={() => withdraw?.()}
              >
                Claim
              </button>
            )
          ) : (
            "Has been won"
          )}
        </div>
      ) : addedHooks &&
        !addedHooks
          .filter((ha: any) => ha.args.hook === hookAddress)
          .map((ha: any) => ha.args.tankId)
          .includes(ownerTank.data!) ? (
        <button
          className="bg-white text-black px-2 disabled:opacity-50 enabled:cursor-pointer"
          disabled={!addHook}
          onClick={() => addHook?.()}
        >
          Accept
        </button>
      ) : (
        "🤝"
      )}
      <div>
        Accepted by:{" "}
        {addedHooks &&
          addedHooks
            ?.filter((ha: any) => ha.args.hook === hookAddress)
            .map((ha: any, i: number) => {
              return (
                <TankName
                  key={i}
                  tankId={ha.args.tankId}
                  gameAddress={gameAddress}
                />
              );
            })}
      </div>
    </div>
  );
}

function TankName({
  tankId,
  gameAddress,
}: {
  tankId: bigint;
  gameAddress: Address;
}) {
  const tankName = useTankNameFromId(gameAddress, tankId);
  console.log({ tankName });
  return <div>{tankName}</div>;
}
