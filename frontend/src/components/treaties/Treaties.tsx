"use client";
import {
  hookFactoryABI,
  hookFactoryAddress,
  tankGameABI,
  useTankGamePlayers,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { useAccount, useBlockNumber, useNetwork } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { Card, CardContent, CardHeader } from "../ui/card";
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

export function Treaties({ gameAddress }: { gameAddress: `0x${string}` }) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  let ownerTank = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
    // @ts-ignore
    address: gameAddress,
  });

  const [hooks, setHooks] = useState<any>();
  const [hooksAdded, setHooksAdded] = useState<any>();
  const [hideNotMine, setHideNotMine] = useState<boolean>(false);
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
      setHooks(hooks.filter((hook: any) => hook.args.tankGame === gameAddress));

      const addedFilter = await publicClient.createContractEventFilter({
        abi: tankGameABI,
        strict: true,
        eventName: "HooksAdded",
        fromBlock: BigInt(0),
        address: gameAddress,
      });

      const hookAddedEvents = await publicClient.getFilterLogs({
        filter: addedFilter,
      });
      setHooksAdded(hookAddedEvents);
    };
    getLogs();
  }, [blockNumber, gameAddress, chain]);
  return (
    <div className="py-4">
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="manage">
            <AccordionTrigger>
              <CardHeader>
                <div className="text-xl ">Manage Tact Pacts</div>
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
        <Accordion type="single" collapsible defaultValue="view">
          <AccordionItem value="view">
            <AccordionTrigger>
              <CardHeader>
                <h1 className="text-xl">View Tact Pacts</h1>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hideNotMine"
                    name="hideNotMine"
                    className="mr-2"
                    onChange={(e) => setHideNotMine(e.target.checked)}
                  />
                  <label htmlFor="hideNotMine">Hide Not Mine</label>
                </div>
                <div className="grid-flow-row auto-rows-max">
                  {hooks
                    ? hooks
                      .sort((a: any, b: any) => a.args._type - b.args._type)
                      .map((hook: any, i: number) => {
                        if (hook.args._type === 1) {
                          return (
                            <Bounty
                              key={i}
                              hookAddress={hook.args.hookAddress}
                              gameAddress={gameAddress}
                              tankId={hook.args.tankId}
                              hideNotMine={hideNotMine}
                              addedHooks={hooksAdded}
                            />
                          );
                        } else if (hook.args._type === 0) {
                          return (
                            <NonAggression
                              hideNotMine={hideNotMine}
                              key={i}
                              hookAddress={hook.args.hookAddress}
                              gameAddress={gameAddress}
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
                      })
                    : "Loading..."}
                </div>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
