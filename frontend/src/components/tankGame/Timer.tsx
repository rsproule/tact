import {
  gameViewAddress,
  useGameViewGetGameEpoch,
  useGameViewGetEpoch,
  useGameViewGetSettings,
  usePrepareTankGameReveal,
  useTankGameEpochStart,
  useTankGameReveal,
  useTankGameRevealBlock,
} from "@/src/generated";
import { BaseError } from "viem";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Pointer } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useBlockNumber, useNetwork, useWaitForTransaction } from "wagmi";

export default function Timer({ address }: { address: `0x${string}` }) {
  const { toast } = useToast();
  const { chain } = useNetwork();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const startEpoch = useTankGameEpochStart({
    // @ts-ignore
    address: address,
  });
  const currentGameEpoch = useGameViewGetGameEpoch({
    watch: true,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  const currentEpoch = useGameViewGetEpoch({
    watch: true,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  let settings = useGameViewGetSettings({
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  const { config: revealConfig } = usePrepareTankGameReveal({
    // @ts-ignore
    address: address,
  });
  const { write: reveal, data: revealData } = useTankGameReveal(revealConfig);
  const { data: revealBlock } = useTankGameRevealBlock({ watch: true });
  useWaitForTransaction({
    hash: revealData?.hash,
    enabled: !!revealData,
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
    <div className="flex justify-center pb-3">
      <Card>
        <CardHeader>
          <CardTitle>Faucet Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            Current Game Epoch: {currentGameEpoch.data?.toString()}
            <br />
            Current Epoch: {currentEpoch.data?.toString()}
            <br />
            {(currentGameEpoch && currentGameEpoch.data) == BigInt(0) ?? (
              <>
                Time till next epoch:
                {currentEpoch.data &&
                  settings.data &&
                  secondsToHMS(
                    Number(
                      getTimeTillNextEpoch(
                        currentEpoch.data!,
                        settings.data?.epochSeconds!
                      )
                    )
                  )}
              </>
            )}
          </>
        </CardContent>
        <CardFooter>
          {blockNumber && revealBlock ? (
            blockNumber > revealBlock ? (
              <Button
                className="w-full"
                disabled={!reveal}
                onClick={() => {
                  reveal?.();
                }}
              >
                <Pointer className="mr-2 h-4 w-4" /> Spawn heart
              </Button>
            ) : (
              "Heart reveal in " +
              (revealBlock - blockNumber).toString() +
              " blocks... approx: " +
              secondsToHMS(Number((revealBlock - blockNumber) * BigInt(12)))
            )
          ) : (
            ""
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

const getTimeTillNextEpoch = (currentEpoch: bigint, epochDuration: bigint) => {
  let nowSeconds = Math.floor(Date.now() / 1000);
  let startTime = currentEpoch * epochDuration;
  let endTime = startTime + epochDuration;
  let blocksTillNextEpoch = endTime - BigInt(nowSeconds);
  return blocksTillNextEpoch;
};

export function secondsToHMS(secs: number) {
  let hours = Math.floor(secs / 3600);
  let minutes = Math.floor((secs % 3600) / 60);
  let seconds = secs % 60;

  // Pad the minutes and seconds with leading zeros, if required
  let hoursString = hours < 10 ? "0" + hours : hours;
  let minutesString = minutes < 10 ? "0" + minutes : minutes;
  let secondsString = seconds < 10 ? "0" + seconds : seconds;

  // Compose the string for display
  let hms = hoursString + ":" + minutesString + ":" + secondsString;
  return hms;
}
