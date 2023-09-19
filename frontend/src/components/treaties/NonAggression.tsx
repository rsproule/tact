import {
  useTankGamePlayers,
  bountyABI,
  usePrepareTankGameAddHooks,
  useTankGameAddHooks,
  usePrepareBountyWithdraw,
  useBountyWithdraw,
  nonAggressionABI,
  usePrepareNonAggressionAccept,
  useNonAggressionAccept,
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
import { secondsToHMS } from "../tankGame/Timer";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function NonAggression({
  hookAddress,
  ownerHookAddress,
  tankId,
}: {
  tankId: bigint;
  hookAddress: `0x${string}`;
  ownerHookAddress: `0x${string}`;
}) {
  const { address } = useAccount();
  const ownerTank = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [treaties, setTreaties] = useState<any>();
  const [proposedTreaties, setProposedTreaties] = useState<any>();
  const [acceptedTreaties, setAcceptedTreaties] = useState<any>();
  // const [bountiesWon, setBountiesWon] = useState<any>();
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
                acceptedTreaty.args.accepter === proposedTreaty.args.proposee &&
                acceptedTreaty.args.expiry === proposedTreaty.args.expiry &&
                acceptedTreaty.args.proposalHook ===
                  proposedTreaty.args.hookProposer
            )
        )
        .filter((treaty: any) => treaty.args.expiry > blockNumber!);
      const filteredAcceptedTreaties = acceptedTreaties.filter(
        (treaty: any) => treaty.args.expiry > blockNumber!
      );
      setProposedTreaties(filteredProposedTreaties);
      setAcceptedTreaties(filteredAcceptedTreaties);
    };
    getLogs();
  }, [hookAddress, blockNumber]);
  const { config: acceptConfig } = usePrepareNonAggressionAccept({
    args: [tankId, hookAddress],
    address: ownerHookAddress, // should be MY hook address
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
      {proposedTreaties && proposedTreaties.length !== 0 && (
        <Card>
          <CardHeader>
            <div className="text-xl">
              Proposed alliances posted by {toTankName(tankId)}
            </div>
          </CardHeader>
          <CardContent>
            {proposedTreaties.map((bounty: any, i: number) => {
              return (
                <div key={i} className="flex justify-between border">
                  <div>Proposer: {toTankName(bounty.args.proposer)}</div>
                  <div>Potential Ally: {toTankName(bounty.args.proposee)}</div>
                  <div>
                    Non-aggression until block: {bounty.args.expiry.toString()}
                  </div>
                  {bounty.args.proposee === ownerTank.data! && (
                    <Button
                      disabled={!accept}
                      onClick={() => {
                        console.log({ accept });
                        accept?.();
                      }}
                    >
                      Accept
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {acceptedTreaties && acceptedTreaties.length !== 0 && (
        <Card>
          <CardHeader>
            <div className="text-xl">
              Active alliances for {toTankName(tankId)}
            </div>
          </CardHeader>
          <CardContent>
            {acceptedTreaties.map((bounty: any, i: number) => {
              return (
                <div key={i} className="flex justify-between border p-1">
                  <div>Proposer: {toTankName(bounty.args.proposer)}</div>
                  <div>Ally: {toTankName(bounty.args.accepter)}</div>
                  <div>
                    Non-aggression until block: {bounty.args.expiry.toString()}
                  </div>
                  <div>
                    Approx time:
                    {secondsToHMS(
                      Number(bounty.args.expiry - blockNumber!) * 12
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
