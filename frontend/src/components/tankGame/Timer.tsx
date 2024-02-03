import {
  gameViewAddress,
  useGameViewGetEpoch,
  useGameViewGetGameEpoch,
  useGameViewGetSettings,
  usePrepareTankGameReveal,
  useTankGameEpochStart,
  useTankGameReveal,
  useTankGameRevealBlock,
} from "@/src/generated";
import { Pointer } from "lucide-react";
import { BaseError } from "viem";
import {
  useAccount,
  useBlockNumber,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from "../ui/use-toast";
import { config } from "@/src/wagmi";
import { useEffect } from "react";

export default function Timer({ address }: { address: `0x${string}` }) {
  const { toast } = useToast();
  const { chain } = useAccount({ config });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const startEpoch = useTankGameEpochStart({
    // @ts-ignore
    address: address,
  });
  const currentGameEpoch = useGameViewGetGameEpoch({
    blockNumber,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  const currentEpoch = useGameViewGetEpoch({
    blockNumber,
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  let settings = useGameViewGetSettings({
    // @ts-ignore
    address: gameViewAddress[chain?.id as keyof typeof gameViewAddress],
    args: [address],
  });
  const { data: revealConfig } = usePrepareTankGameReveal({
    // @ts-ignore
    address: address,
  });
  const { writeContract: reveal, data: hash } = useTankGameReveal();
  const { data: revealBlock } = useTankGameRevealBlock({ blockNumber });
  const { data: receipt, error } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (receipt) {
      toast({
        variant: "success",
        title: "Transaction Confirmed.",
        description: receipt.transactionHash,
      });
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Transaction Failed.",
        description: error.message,
      });
    }
  }, [receipt, error, toast]);
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
                  reveal?.(revealConfig!.request);
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
