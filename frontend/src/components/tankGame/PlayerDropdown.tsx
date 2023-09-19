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
}: {
  setTargetTank: any;
}) {
  return (
    <Select onValueChange={setTargetTank}>
      <SelectTrigger>
        <SelectValue placeholder="Select Tank" />
      </SelectTrigger>
      <SelectContent>
        {TANK_MAPPING.map((tank, i) => {
          return (
            // @ts-ignore
            <SelectItem key={i} value={i}>
              {tank}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
