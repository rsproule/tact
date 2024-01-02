import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Address } from "viem";
import { useTanks } from "./EventsStream";
export default function PlayerDropdown({
  setTargetTank,
  targetTank,
  gameAddress,
}: {
  setTargetTank: any;
  targetTank: string | undefined;
  gameAddress: Address;
}) {
  console.log({ gameAddress })
  const tanks = useTanks(gameAddress);
  console.log({ tanks });
  return (
    <Select value={targetTank} onValueChange={setTargetTank}>
      <SelectTrigger>
        <SelectValue placeholder="Select Tank" />
      </SelectTrigger>
      <SelectContent>
        {tanks.map((tank, i) => {
          return (
            <SelectItem key={i} value={(i + 1).toString()}>
              {tank}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
