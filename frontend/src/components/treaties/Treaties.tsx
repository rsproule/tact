"use client";
import {
  bountyABI,
  hookFactoryABI,
  hookFactoryAddress,
  useBountyCreate,
  useBountyWithdraw,
  useNonAggressionPropose,
  usePrepareBountyCreate,
  usePrepareBountyWithdraw,
  usePrepareNonAggressionPropose,
  usePrepareTankGameAddHooks,
  useTankGameAddHooks,
  useTankGamePlayers,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { BaseError, formatEther, parseEther } from "viem";
import {
  useAccount,
  useBlockNumber,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { toTankName } from "../tankGame/EventsStream";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import CreateBounty from "./CreateBounty";
import Bounty from "./Bounty";
import CreateNonAggression from "./CreateNonAggression";
import NonAggression from "./NonAggression";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function Treaties() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
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
  }, [chain, blockNumber]);
  return (
    <div className="py-4">
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="manage">
            <AccordionTrigger>
              <CardHeader>
                <div className="text-xl ">Manage Treaties</div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                {hooks &&
                  hooks
                    .filter((hook: any) => hook.args.tankId === ownerTank.data)
                    .map((hook: any, i: number) => {
                      if (hook.args._type === 1) {
                        return (
                          <CreateBounty
                            key={i}
                            hookAddress={hook.args.hookAddress}
                          />
                        );
                      } else if (hook.args._type === 0) {
                        return (
                          <CreateNonAggression
                            key={i}
                            hookAddress={hook.args.hookAddress}
                          />
                        );
                      }
                    })}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <Card className="mt-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="view">
            <AccordionTrigger>
              <CardHeader>
                <h1 className="text-xl">View Treaties</h1>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <div className="grid-flow-row auto-rows-max">
                  {hooks &&
                    hooks
                      .sort((a: any, b: any) => a.args._type - b.args._type)
                      .map((hook: any, i: number) => {
                        if (hook.args._type === 1) {
                          return (
                            <Bounty
                              key={i}
                              hookAddress={hook.args.hookAddress}
                              tankId={hook.args.tankId}
                            />
                          );
                        } else if (hook.args._type === 0) {
                          return (
                            <NonAggression
                              key={i}
                              hookAddress={hook.args.hookAddress}
                              tankId={hook.args.tankId}
                              ownerHookAddress={
                                hooks.find(
                                  (h: any) =>
                                    h.args._type === 0 &&
                                    h.args.tankId === ownerTank.data
                                )?.args.hookAddress
                              }
                            />
                          );
                        }
                      })}
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
