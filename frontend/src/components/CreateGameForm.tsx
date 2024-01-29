import React, { useEffect, useState } from "react";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { BaseError, getAddress, parseEther } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  usePrepareTankGameFactoryCreateGame,
  useTankGameFactoryCreateGame,
} from "../generated";
import { useToast } from "./ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

// Define your schema using Zod
const formSchema = z.object({
  playerCount: z.number(),
  boardSize: z.number(),
  initAPs: z.number(),
  initHearts: z.number(),
  initShootRange: z.number(),
  epochSeconds: z.number(),
  buyInMinimum: z.string(),
  revealWaitBlocks: z.number(),
  autoStart: z.boolean(),
  root: z.string(),
});

export default function CreateGameForm({
  implAddress,
}: {
  implAddress: `0x${string}`;
}) {
  const { toast } = useToast();
  const { address: deployerAddress } = useAccount();
  const [formState, setFormState] = useState({
    playerCount: 10,
    boardSize: 30,
    initAPs: 1,
    initHearts: 3,
    initShootRange: 3,
    epochSeconds: 60,
    buyInMinimum: "0",
    revealWaitBlocks: 60,
    autoStart: "true",
    root: "0x0000000000000000000000000000000000000000000000000000000000000000",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };
  let { config } = usePrepareTankGameFactoryCreateGame({
    args: [
      implAddress,
      {
        playerCount: BigInt(formState.playerCount),
        boardSize: BigInt(formState.boardSize),
        initAPs: BigInt(formState.initAPs),
        initHearts: BigInt(formState.initHearts),
        initShootRange: BigInt(formState.initShootRange),
        epochSeconds: BigInt(formState.epochSeconds),
        buyInMinimum: parseEther(formState.buyInMinimum),
        revealWaitBlocks: BigInt(formState.revealWaitBlocks),
        autoStart: Boolean(formState.autoStart),
        root: formState.root as `0x${string}`,
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerCount: formState.playerCount,
      boardSize: formState.boardSize,
      initAPs: formState.initAPs,
      initHearts: formState.initHearts,
      initShootRange: formState.initShootRange,
      epochSeconds: formState.epochSeconds,
      buyInMinimum: formState.buyInMinimum,
      revealWaitBlocks: formState.revealWaitBlocks,
      autoStart: Boolean(formState.autoStart),
      root: formState.root,
    },
  });
  return (
    <CardContent>
      <Form {...form}>
        <FormField
          name="playerCount"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Player Count</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.playerCount}
                />
              </FormControl>
              <FormDescription>Enter the number of players</FormDescription>
            </div>
          )}
        />
        <FormField
          name="boardSize"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Board Size</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.boardSize}
                />
              </FormControl>
              <FormDescription>
                Enter the size of the board (must be div by 3){" "}
              </FormDescription>
            </div>
          )}
        />
        <FormField
          name="initAPs"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Initial APs</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.initAPs}
                />
              </FormControl>
              <FormDescription>Enter the initial APs</FormDescription>
            </div>
          )}
        />
        <FormField
          name="initHearts"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Initial Hearts</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.initHearts}
                />
              </FormControl>
              <FormDescription>
                Enter the initial number of hearts
              </FormDescription>
            </div>
          )}
        />
        <FormField
          name="initShootRange"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Initial Shoot Range</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      handleInputChange(e);
                    }
                  }}
                  value={formState.initShootRange}
                />
              </FormControl>
              <FormDescription>Enter the initial shoot range</FormDescription>
            </div>
          )}
        />
        <FormField
          name="epochSeconds"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Epoch Seconds</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.epochSeconds}
                />
              </FormControl>
              <FormDescription>Enter the epoch seconds</FormDescription>
            </div>
          )}
        />
        <FormField
          name="buyInMinimum"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Buy In Minimum</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      handleInputChange(e);
                    }
                  }}
                  value={formState.buyInMinimum}
                />
              </FormControl>
              <FormDescription>Enter the minimum buy in</FormDescription>
            </div>
          )}
        />
        <FormField
          name="revealWaitBlocks"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Reveal Wait Blocks</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    try {
                      BigInt(e.target.value);
                      handleInputChange(e);
                    } catch {
                      console.error("Value is not convertible to BigInt");
                    }
                  }}
                  value={formState.revealWaitBlocks}
                />
              </FormControl>
              <FormDescription>
                Enter the number of blocks to wait for reveal
              </FormDescription>
            </div>
          )}
        />
        {/* <FormField */}
        {/*   name="root" */}
        {/*   control={form.control} */}
        {/*   render={({ field }) => ( */}
        {/*     <div> */}
        {/*       <FormLabel>Players</FormLabel> */}
        {/*       <FormControl> */}
        {/*         <> */}
        {/*           <RootGenerator setFormState={setFormState} /> */}
        {/*           <div>Merkle Root: {formState.root}</div> */}
        {/*         </> */}
        {/*       </FormControl> */}
        {/*       <FormDescription> */}
        {/*         Enter the players to join, leave this blank and anyone can join */}
        {/*       </FormDescription> */}
        {/*     </div> */}
        {/*   )} */}
        {/* /> */}
        <FormField
          name="autoStart"
          control={form.control}
          render={({ field }) => (
            <div>
              <FormLabel>Auto Start</FormLabel>
              <FormControl>
                <Input
                  type="checkbox"
                  {...field}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  value={field.value ? "true" : "false"}
                />
              </FormControl>
              <FormDescription>
                Check if the game should auto start
              </FormDescription>
            </div>
          )}
        />
        <Button
          className="w-full mt-5"
          type="submit"
          disabled={!create}
          onClick={() => create?.()}
        >
          Submit
        </Button>
      </Form>
    </CardContent>
  );
}

function RootGenerator({
  setFormState,
}: {
  setFormState: React.Dispatch<
    React.SetStateAction<{
      playerCount: number;
      boardSize: number;
      initAPs: number;
      initHearts: number;
      initShootRange: number;
      epochSeconds: number;
      buyInMinimum: number;
      revealWaitBlocks: number;
      autoStart: string;
      root: string;
    }>
  >;
}) {
  const [list, setList] = useState<Array<[string, string]>>([["", ""]]);
  const [hasError, setHasError] = useState(false);

  const handleAdd = () => {
    setList([...list, ["", ""]]);
  };

  const handleDelete = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    position: number,
    value: string
  ) => {
    const newList = [...list];
    newList[index][position] = value;
    setList(newList);
  };

  useEffect(() => {
    // generate the merkle root here, and call update() with that root
    try {
      const values = list.map((item) => {
        return [getAddress(item[1]), item[0]];
      });
      const tree = StandardMerkleTree.of(values, ["address", "string"]);
      setFormState((prevState) => ({ ...prevState, root: tree.root }));
      setHasError(false);
    } catch (err) {
      setHasError(true);
    }
  }, [list]);

  return (
    <div className={`container ${hasError ? "border-red-500 border-2" : ""}`}>
      <Card>
        {list.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex flex-col sm:flex-row">
              Player {index + 1}
              <div className="sm:w-1/3">
                <label htmlFor={`name-${index}`}>Name</label>
                <Input
                  id={`name-${index}`}
                  value={item[0]}
                  onChange={(e) => handleInputChange(index, 0, e.target.value)}
                />
              </div>
              <div className="sm:w-1/3">
                <label htmlFor={`address-${index}`}>Address</label>
                <Input
                  id={`address-${index}`}
                  value={item[1]}
                  onChange={(e) => handleInputChange(index, 1, e.target.value)}
                />
              </div>
              <div className="sm:w-1/3 flex items-end justify-end">
                <Button
                  className="mt-2 sm:mt-0 bg-red-500"
                  onClick={() => handleDelete(index)}
                >
                  X
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button onClick={handleAdd}>+</Button>
      </Card>
    </div>
  );
}
