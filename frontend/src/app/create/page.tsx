"use client";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  playerCount: z
    .number()
    .min(1, {
      message: "Player count must be at least 1.",
    })
    .max(50, {
      message: "Player count must be at most 50.",
    }),
  boardSize: z
    .number()
    .min(1, {
      message: "Board size must be at least 1.",
    })
    .max(50, { message: "Board size must be at most 50." }),
  initAPs: z.number().min(0).max(50, { message: "APs must be at most 50." }),
  initHearts: z
    .number()
    .min(0)
    .max(50, { message: "Hearts must be at most 50." }),
  epochSeconds: z
    .number()
    .min(1, { message: "Epoch must be at least 1 second." }),
  buyInMinimum: z.number().min(0, { message: "Buy in must be at least 0." }),
  revealWaitBlocks: z
    .number()
    .min(1, { message: "Reveal wait must be at least 1 block." }),
  root: z.string(),
});
export default function CreateGamePage() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerCount: 10,
      boardSize: 40,
      initAPs: 1,
      initHearts: 1,
      epochSeconds: 1,
      buyInMinimum: 1,
      revealWaitBlocks: 1,
      root: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="grid container">
      <Card>
        <CardHeader>
          <CardTitle>Create Game</CardTitle>
          <CardDescription>Create a new game</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="playerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Size</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many players should be in the game?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="boardSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Size</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How big should the board be (radius)?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initAPs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Action Points</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many action points should each player start with?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initHearts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Hearts</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many hearts should each player start with?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="epochSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Epoch Length</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many seconds should each epoch last?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buyInMinimum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy in Min</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much ETH needs to be deposited to join the game?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revealWaitBlocks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reveal Wait Blocks</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How often does the board randomly drop a new heart (in #
                      of blocks)?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="root"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Players Merkle Root</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      The merkle root of all addresses that are permitted to
                      join the (everyone if 0x0)?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
