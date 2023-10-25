import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { BaseError } from "viem";
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
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm, useFormContext } from "react-hook-form";
import { Input } from "./ui/input";

// Define your schema using Zod
const formSchema = z.object({
  playerCount: z.number(),
  boardSize: z.number(),
  initAPs: z.number(),
  initHearts: z.number(),
  initShootRange: z.number(),
  epochSeconds: z.number(),
  buyInMinimum: z.number(),
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
    buyInMinimum: 0,
    revealWaitBlocks: 60,
    autoStart: "true",
    root: "0x0000000000000000000000000000000000000000000000000000000000000000",
  });

  console.log(formState);
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
        buyInMinimum: BigInt(formState.buyInMinimum),
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
      autoStart: formState.autoStart,
      root: formState.root,
    },
  });
  return (
    <Form
      {...form}
      // onSubmit={(data) => console.log(data)}
      // resolver={zodResolver(formSchema)}
      defaultValues={formState}
    >
      <FormField
        name="playerCount"
        control={form.control}
        render={({ field }) => (
          <div>
            <FormLabel>Player Count</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
            </FormControl>
            <FormDescription>Enter the size of the board (must be div by 3)</FormDescription>
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
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
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
              <Input {...field} onChange={handleInputChange} />
            </FormControl>
            <FormDescription>
              Enter the number of blocks to wait for reveal
            </FormDescription>
          </div>
        )}
      />
      <FormField
        name="root"
        control={form.control}
        render={({ field }) => (
          <div>
            <FormLabel>Root</FormLabel>
            <FormControl>
              <Input {...field} onChange={handleInputChange} />
            </FormControl>
            <FormDescription>Enter the root</FormDescription>
          </div>
        )}
      />
      <FormField
        name="autoStart"
        control={form.control}
        render={({ field }) => (
          <div>
            <FormLabel>Auto Start</FormLabel>
            <FormControl>
              <Input type="checkbox" {...field} onChange={handleInputChange} />
            </FormControl>
            <FormDescription>
              Check if the game should auto start
            </FormDescription>
          </div>
        )}
      />
      <Button className="w-full mt-5" type="submit" disabled={!create} onClick={() => create?.()}>
        Submit
      </Button>
    </Form>
  );
}
