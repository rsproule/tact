import { useTankGameEpochStart, useTankGameGetEpoch } from "@/src/generated";
import { useBlockNumber } from "wagmi";

export default function Timer() {
  const startEpoch = useTankGameEpochStart({ watch: true });
  const currentEpoch = useTankGameGetEpoch({ watch: true });
  return (
    <div className="block">
      <>Start epoch: {startEpoch.data && startEpoch.data!.toString()}</>
      <br />
      <>Current epoch: {currentEpoch.data && currentEpoch.data!.toString()}</>
      <br />
    </div>
  );
}
