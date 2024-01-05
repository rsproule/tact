"use client";
import {
  tankGameAddress,
  tankGameFactoryABI,
  tankGameFactoryAddress,
  useTankGamePlayersCount,
  useTankGameState,
} from "@/src/generated";
import { useEffect, useState } from "react";
import {
  Address,
  useAccount,
  useBalance,
  useBlockNumber,
  useNetwork,
} from "wagmi";
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
  const [shouldFilter, setShouldFilter] = useState(true);
  const { address } = useAccount();
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

  if (!address) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Connect your wallet to see games.
      </div>
    );
  }
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
      <div>
        <input
          type="checkbox"
          id="filter"
          name="filter"
          checked={shouldFilter}
          onChange={() => setShouldFilter(!shouldFilter)}
        />
        <label htmlFor="filter">Filter Joinable Games</label>
      </div>
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
                filter={shouldFilter}
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
  filter,
}: {
  address: Address;
  numPlayers: bigint;
  isOpen: boolean;
  buyIn: bigint;
  filter: boolean;
}) {
  let { data: players } = useTankGamePlayersCount({
    watch: true,
    // @ts-ignore
    address: address,
  });
  let { data: balance } = useBalance({ address: address, watch: true });
  let { data: gameState } = useTankGameState({
    watch: true,
    // @ts-ignore
    address: address,
  });
  let stateString =
    gameState !== undefined
      ? gameState === 0
        ? "Waiting for players"
        : gameState === 1
        ? "In Progress"
        : "Game Over"
      : "...";
  if (filter && stateString !== "Waiting for players") {
    return null;
  }
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
            <div>State: {stateString}</div>
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
