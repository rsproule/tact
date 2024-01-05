import {
  useTankGamePlayers,
  nonAggressionABI,
  usePrepareNonAggressionAccept,
  useNonAggressionAccept,
  gameViewAddress,
  useGameViewGetGameEpoch,
  usePrepareITreatyAccept,
} from "@/src/generated";
import { useState, useEffect } from "react";
import { Address, BaseError } from "viem";
import {
  useAccount,
  useBlockNumber,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { useTankNameFromId } from "../tankGame/EventsStream";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function NonAggression({
  hookAddress,
  gameAddress,
  ownerHookAddress,
  tankId,
  hideNotMine,
}: {
  tankId: bigint;
  hookAddress: Address;
  gameAddress: Address;
  ownerHookAddress: Address;
  hideNotMine: boolean;
}) {
  const { address } = useAccount();
  const ownerTank = useTankGamePlayers({
    // @ts-ignore
    address: gameAddress,
    args: [address!],
    enabled: !!address,
  });
  const { chain } = useNetwork();
  const { data: epoch } = useGameViewGetGameEpoch({
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    watch: true,
    args: [gameAddress],
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [treaties, setTreaties] = useState<any>();
  useEffect(() => {
    const getLogs = async () => {
      const publicClient = getPublicClient();
      const filter = await publicClient.createContractEventFilter({
        abi: nonAggressionABI,
        strict: true,
        fromBlock: BigInt(0),
        address: hookAddress,
      });
      const allLogs = await publicClient.getFilterLogs({
        filter,
      });
      const proposedTreaties = allLogs.filter(
        (bounty: any) => bounty.eventName === "ProposedTreaty"
      );
      const acceptedTreaties = allLogs.filter(
        (bounty: any) => bounty.eventName === "AcceptedTreaty"
      );
      const filteredProposedTreaties = proposedTreaties
        .filter(
          (proposedTreaty: any) =>
            !acceptedTreaties.some(
              (acceptedTreaty: any) =>
                acceptedTreaty.args.proposer === proposedTreaty.args.proposer &&
                acceptedTreaty.args.proposee === proposedTreaty.args.proposee &&
                acceptedTreaty.args.expiry === proposedTreaty.args.expiry &&
                acceptedTreaty.args.hookProposer ===
                  proposedTreaty.args.proposalHook
            )
        )
        .filter((treaty: any) => treaty.args.expiry > epoch!);
      const filteredAcceptedTreaties = acceptedTreaties.filter(
        (treaty: any) => treaty.args.expiry > epoch!
      );
      const mergedTreaties = [
        ...filteredProposedTreaties,
        ...filteredAcceptedTreaties,
      ].map((treaty) => ({
        ...treaty,
        isAccepted: filteredAcceptedTreaties.includes(treaty),
      }));
      setTreaties(mergedTreaties);
    };
    getLogs();
  }, [hookAddress, blockNumber, epoch]);

  const tankName = useTankNameFromId(gameAddress, tankId);
  const { config: acceptConfig } = usePrepareNonAggressionAccept({
    args: [tankId, hookAddress], // the information for the treaty we want to accept
    address: ownerHookAddress, // MY hook address
  });
  const { write: accept, data: acceptData } =
    useNonAggressionAccept(acceptConfig);
  useWaitForTransaction({
    hash: acceptData?.hash,
    enabled: !!acceptData,
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
    <div className="">
      {treaties &&
        treaties.filter((t: any) => {
          if (hideNotMine) {
            return (
              t.args.proposer === ownerTank.data! ||
              t.args.proposee === ownerTank.data!
            );
          }
          return true;
        }).length !== 0 && (
          <Card>
            <CardHeader>
              <div className="text-xl">🛡️ {tankName} Alliances</div>
            </CardHeader>
            <CardContent>
              {treaties
                .filter((t: any) => {
                  if (hideNotMine) {
                    return (
                      t.args.proposer === ownerTank.data! ||
                      t.args.proposee === ownerTank.data!
                    );
                  }
                  return true;
                })
                .map((bounty: any, i: number) => (
                  <BountyComponent
                    key={i}
                    bounty={bounty}
                    gameAddress={gameAddress}
                    ownerTank={ownerTank}
                    accept={accept}
                  />
                ))}
            </CardContent>
          </Card>
        )}
    </div>
  );
}

function BountyComponent({
  bounty,
  gameAddress,
  ownerTank,
  accept,
}: {
  bounty: any;
  gameAddress: Address;
  ownerTank: any;
  accept: any;
}) {
  const proposerName = useTankNameFromId(gameAddress, bounty.args.proposer);
  const proposeeName = useTankNameFromId(gameAddress, bounty.args.proposee);
  return (
    <div className="flex justify-between border">
      <div>Proposer: {proposerName}</div>
      <div>{bounty.isAccepted ? "🤝 accepted" : "⏳ pending..."}</div>
      <div>Ally: {proposeeName}</div>
      <div>Non-aggression until epoch: {bounty.args.expiry.toString()}</div>
      {bounty.args.proposee === ownerTank.data! && !bounty.isAccepted && (
        <button
          className="bg-white text-black px-2 disabled:opacity-50 enabled:cursor-pointer"
          disabled={!accept}
          onClick={() => {
            accept?.();
          }}
        >
          Accept
        </button>
      )}
    </div>
  );
}
