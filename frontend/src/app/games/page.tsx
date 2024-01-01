"use client";
import {
  tankGameAddress,
  tankGameFactoryABI,
  tankGameFactoryAddress,
  useTankGamePlayersCount,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { Address, useBalance, useBlockNumber, useNetwork } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import CreateGameForm from "@/src/components/CreateGameForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatEther } from "viem";
import { Button } from "@/src/components/ui/button";

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
  console.log({ games });
  return (
    <div className="container pb-20">
      <Accordion type="single" collapsible>
        <AccordionItem value="manage">
          <AccordionTrigger title="test" className="text-center">
            <Button className="mx-auto w-full">Create a game</Button>
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
      <h2 className="mt-10 text-2xl">Existing games:</h2>
      <div className="grid-flow-row auto-rows-max">
        {games &&
          games
            // @ts-ignore
            ?.slice()
            .reverse()
            .map((game: any, i: number) => (
              <GameTile
                key={i}
                address={game.args.game}
                numPlayers={game.args.settings.playerCount}
                isOpen={game.args.settings.root === zero}
                buyIn={game.args.settings.buyInMinimum}
              />
            ))}
      </div>
    </div>
  );
}

const zero =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

function GameTile({
  address,
  numPlayers,
  isOpen,
  buyIn,
}: {
  address: Address;
  numPlayers: bigint;
  isOpen: boolean;
  buyIn: bigint;
}) {
  let { data: players } = useTankGamePlayersCount({
    watch: true,
    // @ts-ignore
    address: address,
  });
  let { data: balance } = useBalance({ address: address, watch: true });
  return (
    <div className="my-5">
      <a href={`game/${address}`}>
        <Card>
          <CardHeader>
            <CardTitle>Game Address: {address}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {players?.toString()}/{numPlayers.toString()} players in game
            </div>
            <div>Auth mode: {isOpen ? "Open to world" : "Whitelist"}</div>
            <div>Buy in minimum: {formatEther(buyIn)} eth</div>
            <div>
              Current pot: {balance ? formatEther(balance.value) : "..."} eth
            </div>
          </CardContent>
        </Card>
      </a>
    </div>
  );
}
