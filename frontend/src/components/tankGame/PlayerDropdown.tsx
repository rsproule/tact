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
  const tanks = useTanks(gameAddress);
  return (
    <Select value={targetTank} onValueChange={setTargetTank}>
      <SelectTrigger>
        <SelectValue placeholder="Select Tank" />
      </SelectTrigger>
      <SelectContent>
        {tanks.map((tank, i) => {
          return (
            <SelectItem key={i} value={(i + 1).toString()}>
              {i} - {tank}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
