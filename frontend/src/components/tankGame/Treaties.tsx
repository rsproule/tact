"use client";
import {
  bountyABI,
  hookFactoryABI,
  hookFactoryAddress,
  tankGameABI,
  tankGameAddress,
  useBountyCreateBounty,
  useBountyWithdrawBounty,
  useGameViewGetAllTanks,
  useNonAggressionPropose,
  usePrepareBountyCreateBounty,
  usePrepareBountyWithdrawBounty,
  usePrepareNonAggressionPropose,
  usePrepareTankGameAddHooks,
  useTankGameAddHooks,
  useTankGamePlayers,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { getPublicClient } from "wagmi/actions";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { toTankName } from "./EventsStream";
import { BaseError, formatEther, parseEther } from "viem";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";

export function Treaties() {
  const { chain } = useNetwork();
  let { address } = useAccount();
  let ownerTank = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });

  const [hooks, setHooks] = useState<any>();
  useEffect(() => {
    const getLogs = async () => {
      const publicClient = getPublicClient();
      const chainId = chain?.id;
      const filter = await publicClient.createContractEventFilter({
        abi: hookFactoryABI,
        strict: true,
        eventName: "HookCreated",
        fromBlock: BigInt(0),
        address: hookFactoryAddress[chainId as keyof typeof hookFactoryAddress],
      });
      const hooks = await publicClient.getFilterLogs({
        filter,
      });
      setHooks(hooks);
    };
    getLogs();
  }, [chain]);
  return (
    <div className="py-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl">My Treaties</h1>
        </CardHeader>
        <CardContent>
          {hooks &&
            hooks
              .filter((hook: any) => hook.args.tankId === ownerTank.data)
              .map((hook: any, i: number) => {
                if (hook.args._type === 1) {
                  return (
                    <CreateBounty key={i} hookAddress={hook.args.hookAddress} />
                  );
                } else if (hook.args._type === 0) {
                  return (
                    <NonAggression
                      key={i}
                      hookAddress={hook.args.hookAddress}
                    />
                  );
                }
              })}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h1 className="text-xl">Open Treaties</h1>
        </CardHeader>
        <CardContent>
          <div className="grid-flow-row auto-rows-max">
            {hooks &&
              hooks.map((hook: any, i: number) => {
                if (hook.args._type === 1) {
                  return (
                    <Bounty
                      key={i}
                      hookAddress={hook.args.hookAddress}
                      tankId={hook.args.tankId}
                    />
                  );
                } else if (hook.args._type === 0) {
                  return <></>;
                  return <div>non aggro</div>;
                }
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OpenBounties({ allBountyHooks }: { allBountyHooks: `0x${string}`[] }) {
  return <>bounties</>;
}

function Bounty({
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
  const { chain } = useNetwork();
  const [bounties, setBounties] = useState<any>();
  const [bountiesWon, setBountiesWon] = useState<any>();
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
      setBounties(postedBounties);
      const wonBounties = bounties.filter(
        (bounty: any) => bounty.eventName === "BountyWon"
      );
      setBountiesWon(wonBounties);
    };
    getLogs();
  }, [hookAddress]);
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
  const { config: withdrawConfig } = usePrepareBountyWithdrawBounty({
    args: [ownerTank.data!, address!],
    enabled: !!ownerTank,
    address: hookAddress,
  });
  const { write: withdraw, data: withdrawData } =
    useBountyWithdrawBounty(withdrawConfig);
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
  if (!bounties || bounties.length === 0) {
    return <></>;
  }
  return (
    <div className="border">
      <div className="text-xl">Bounties posted by {tankId.toString()}</div>
      {bounties?.map((bounty: any, i: number) => {
        console.log(bounties);
        return (
          <div key={i} className="flex justify-between border">
            <div>Target: {toTankName(bounty.args.target)}</div>
            <div>Proposer: {toTankName(bounty.args.tankId)}</div>
            <div>Bounty amount: {formatEther(bounty.args.amount)}</div>
            {bountiesWon?.find(
              (wonBounty: any) =>
                wonBounty.args.bountyId === bounty.args.bountyId
            ) ? (
              <div>
                {bountiesWon?.find(
                  (wonBounty: any) => wonBounty.args.winner === ownerTank.data
                ) ? (
                  <Button disabled={!withdraw} onClick={() => withdraw?.()}>
                    Claim
                  </Button>
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
    </div>
  );
}

function CreateBounty({ hookAddress }: { hookAddress: `0x${string}` }) {
  const [targetTank, setTargetTank] = useState<bigint>(BigInt(0));
  const [bounty, setBounty] = useState<string>("");
  const { config: createBountyConfig } = usePrepareBountyCreateBounty({
    address: hookAddress,
    args: [targetTank],
    value: parseEther(bounty),
    enabled: targetTank !== BigInt(0),
  });

  const { write: create, data: createData } =
    useBountyCreateBounty(createBountyConfig);
  useWaitForTransaction({
    hash: createData?.hash,
    enabled: !!createData,
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
    <div className="border">
      Create Bounty:
      <div className="flex">
        <Input
          type="number"
          onChange={(e) => setTargetTank(BigInt(e.target.value))}
          placeholder="target"
        />
        <Input
          type="number"
          value={bounty}
          onChange={(e) => {
            try {
              parseEther(e.target.value);
              setBounty(e.target.value);
            } catch (e) {}
          }}
          placeholder="bounty"
        />
      </div>
      <Button disabled={!create} onClick={() => create?.()}>
        Create
      </Button>
    </div>
  );
}
function NonAggression({ hookAddress }: { hookAddress: `0x${string}` }) {
  const [targetTank, setTargetTank] = useState<bigint>(BigInt(0));
  const [expiry, setExpiry] = useState<bigint>(BigInt(0));
  const { config: createConfig } = usePrepareNonAggressionPropose({
    address: hookAddress,
    args: [targetTank, expiry],
    enabled: targetTank !== BigInt(0) && expiry !== BigInt(0),
  });

  const { write: create, data: createData } =
    useNonAggressionPropose(createConfig);
  useWaitForTransaction({
    hash: createData?.hash,
    enabled: !!createData,
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
    <div className="border">
      Create Non-aggression pact
      <div className="flex">
        <Input
          type="number"
          onChange={(e) => setTargetTank(BigInt(e.target.value))}
          placeholder="ally"
        />
        <Input
          type="number"
          onChange={(e) => setExpiry(BigInt(e.target.value))}
          placeholder="expiry"
        />
      </div>
      <Button disabled={!create} onClick={() => create?.()}>
        Create
      </Button>
    </div>
  );
}
