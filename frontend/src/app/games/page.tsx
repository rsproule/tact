"use client";
import {
  tankGameAddress,
  tankGameFactoryABI,
  tankGameFactoryAddress,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { useBlockNumber, useNetwork } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import CreateGameForm from "@/src/components/CreateGameForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function GamesList() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [games, setGames] = useState();
  const { chain } = useNetwork();
  const getLogs = async () => {
    const publicClient = getPublicClient();
    const chainId = chain?.id;
    const filter = await publicClient.createContractEventFilter({
      abi: tankGameFactoryABI,
      strict: true,
      fromBlock: BigInt(0),
      address:
        tankGameFactoryAddress[chainId as keyof typeof tankGameFactoryAddress],
    });
    return await publicClient.getFilterLogs({
      filter,
    });
  };

  useEffect(() => {
    getLogs()
      .then((logs) => {
        // @ts-ignore
        setGames(logs);
      })
      .catch(console.error);
  }, [blockNumber]);
  console.log(games);
  return (
    <div className="container pb-20">
      <Card>
        <Accordion type="single" collapsible>
          <AccordionItem value="manage">
            <AccordionTrigger>
              <div className="w-full">Create a game</div>
            </AccordionTrigger>
            <AccordionContent>
              <CreateGameForm
                implAddress={
                  tankGameAddress[chain?.id as keyof typeof tankGameAddress]
                }
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      <div className="mt-10">Existing games:</div>
      <div className="grid-flow-row auto-rows-max">
        {games &&
          // @ts-ignore
          games?.slice().reverse().map((game, i) => (
            <div key={i} className="my-5">
              <a href={`game/${game.args.game}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>Game address: {game.args.game}</CardTitle>
                    <CardContent>
                      {/* <div>NumPlayers : {game.args.settings.}</div> */}
                      {Object.keys(game.args.settings).map((key, i) => (
                        <div key={i}>
                          {key}: {game.args.settings[key].toString()}
                        </div>
                      ))}
                    </CardContent>
                  </CardHeader>
                </Card>
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}
