import {
  useTankGamePlayers,
  useTankGameGetSettings,
  nonAggressionABI,
  usePrepareNonAggressionAccept,
  useNonAggressionAccept,
  useTankGameGetGameEpoch,
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
  hideNotMine,
}: {
  tankId: bigint;
  hookAddress: `0x${string}`;
  ownerHookAddress: `0x${string}`;
  hideNotMine: boolean;
}) {
  const { address } = useAccount();
  const ownerTank = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  const { data: epoch } = useTankGameGetGameEpoch({ watch: true });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [treaties, setTreaties] = useState<any>();
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
                acceptedTreaty.args.proposee === proposedTreaty.args.proposee &&
                acceptedTreaty.args.expiry === proposedTreaty.args.expiry &&
                acceptedTreaty.args.proposalHook ===
                  proposedTreaty.args.hookProposer
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
              <div className="text-xl">🛡️ {toTankName(tankId)} Alliances</div>
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
                .map((bounty: any, i: number) => {
                  return (
                    <div key={i} className="flex justify-between border">
                      <div>Proposer: {toTankName(bounty.args.proposer)}</div>
                      <div>{bounty.isAccepted ? "🤝" : "⏳"}</div>
                      <div>Ally: {toTankName(bounty.args.proposee)}</div>
                      <div>
                        Non-aggression until epoch:{" "}
                        {bounty.args.expiry.toString()}
                      </div>
                      {/* <div>
                          Approx time:
                          {secondsToHMS(
                            Number(bounty.args.expiry - blockNumber!) * 12
                          )}
                        </div> */}
                      {bounty.args.proposee === ownerTank.data! &&
                        !bounty.isAccepted && (
                          <Button disabled={!accept} onClick={() => accept?.()}>
                            Accept
                          </Button>
                        )}
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        )}
      {/* {acceptedTreaties && acceptedTreaties.length !== 0 && (
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
      )} */}
    </div>
  );
}
