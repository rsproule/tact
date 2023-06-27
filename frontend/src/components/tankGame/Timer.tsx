import {
  useTankGameEpochStart,
  useTankGameGetEpoch,
  useTankGameSettings,
} from "@/src/generated";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Timer() {
  const currentEpoch = useTankGameGetEpoch({ watch: true });
  const settings = useTankGameSettings();
  return (
    <div className="flex justify-center pb-3">
      <Card>
        <CardHeader>
          <CardTitle>Faucet Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            Time till next epoch:{" "}
            {currentEpoch.data &&
              getTimeTillNextEpoch(
                currentEpoch.data!,
                settings.data?.epochSeconds!
              ).toString()}
          </>
        </CardContent>
      </Card>
    </div>
  );
}

const getTimeTillNextEpoch = (currentEpoch: bigint, epochDuration: bigint) => {
  let nowSeconds = Math.floor(Date.now() / 1000);
  let startBlock = currentEpoch * epochDuration;
  let endBlock = startBlock + epochDuration;
  let blocksTillNextEpoch = endBlock - BigInt(nowSeconds);
  return blocksTillNextEpoch;
};
