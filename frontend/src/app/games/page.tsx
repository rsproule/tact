"use client";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/components/ui/use-toast";
import {
  tankGameAddress,
  tankGameFactoryABI,
  tankGameFactoryAddress,
  usePrepareTankGameFactoryCreateGame,
  useTankGameFactoryCreateGame,
} from "@/src/generated";
import { useEffect, useState } from "react";
import { BaseError } from "viem";
import {
  useAccount,
  useBlockNumber,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { getPublicClient } from "wagmi/actions";

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
    <div className="container">
      <div>
        create game
        <CreateGame
          implAddress={
            tankGameAddress[chain?.id as keyof typeof tankGameAddress]
          }
        />
      </div>
      <div>Tact games:</div>
      {/* @ts-ignore */}
      <>
        {games &&
          // @ts-ignore
          games?.map((game, i) => (
            <a key={i} href={`game/${game.args.game}`}>
              {game.args.game} <br />
            </a>
          ))}
      </>
    </div>
  );
}

function CreateGame({ implAddress }: { implAddress: `0x${string}` }) {
  const { toast } = useToast();
  const { address: deployerAddress } = useAccount();
  let { config } = usePrepareTankGameFactoryCreateGame({
    args: [
      implAddress,
      {
        playerCount: BigInt(2),
        boardSize: BigInt(12),
        initAPs: BigInt(1),
        initHearts: BigInt(3),
        initShootRange: BigInt(3),
        epochSeconds: BigInt(60),
        buyInMinimum: BigInt(0),
        revealWaitBlocks: BigInt(60),
        autoStart: true,
        root: "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
      deployerAddress!,
    ],
    enabled: true,
  });
  const { write: create, data } = useTankGameFactoryCreateGame(config);
  useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data,
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
    // <DropdownMenuContent className="w-56">
    <Button onClick={() => create?.()}>Create Game</Button>
    // </DropdownMenuContent>
  );
}
