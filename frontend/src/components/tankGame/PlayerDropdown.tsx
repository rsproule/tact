import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TANK_MAPPING } from "./EventsStream";
export default function PlayerDropdown({
  setTargetTank,
  targetTank,
}: {
  setTargetTank: any;
  targetTank: string | undefined;
}) {
  return (
    <Select value={targetTank} onValueChange={setTargetTank}>
      <SelectTrigger>
        <SelectValue placeholder="Select Tank" />
      </SelectTrigger>
      <SelectContent>
        {TANK_MAPPING.map((tank, i) => {
          return (
            // @ts-ignore
            <SelectItem key={i} value={i + 1}>
              {tank}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
