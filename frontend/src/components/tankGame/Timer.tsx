import {
  useITankGameGetSettings,
  usePrepareTankGameReveal,
  useTankGameEpochStart,
  useTankGameGetEpoch,
  useTankGameReveal,
  useTankGameRevealBlock,
} from "@/src/generated";
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

export default function Timer() {
  const { toast } = useToast();
  const startEpoch = useTankGameEpochStart();
  const currentEpoch = useTankGameGetEpoch({ watch: true });
  const settings = useITankGameGetSettings();
  const { config: revealConfig } = usePrepareTankGameReveal();
  const { write: reveal, data: revealData } = useTankGameReveal(revealConfig);
  const revealBlock = useTankGameRevealBlock();

  return (
    <div className="flex justify-center pb-3">
      <Card>
        <CardHeader>
          <CardTitle>Faucet Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            Current Epoch:{" "}
            {currentEpoch.data &&
              startEpoch.data &&
              (currentEpoch.data! - startEpoch.data!).toString()}
            <br />
            Time till next epoch:{" "}
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
        </CardContent>
        <CardFooter>
          {!!reveal && (
            <Button
              className="w-full"
              disabled={!reveal}
              onClick={() => {
                reveal?.();
              }}
            >
              <Pointer className="mr-2 h-4 w-4" /> Spawn heart
            </Button>
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

function secondsToHMS(secs: number) {
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
