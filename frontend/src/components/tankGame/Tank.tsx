import { useAccount } from "wagmi";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Heart, Target, User, Zap } from "lucide-react";
import { ITank } from "./ITank";

const OWNERS: Map<String, String> = new Map<string, string>([
  ["0x5337122c6b5ce24D970Ce771510D22Aeaf038C44", "Ryan"],
  ["0x425374B4da782f0ec5DeC7b45B0C1e08dc6B5A65", "Caleb"],
  ["0x2a233E71Ba12fE39E587D402Acf4E41e8B008e31", "Spencer"],
  ["0x859B7FA9b70746720bdeA1453D04161F3C829684", "Yigit"],
  ["0xb7430de9B4D8e5cDB951019d7651cD5fda630498", "Sam"],
  ["0x5CE306109b8de8d001d52F2140383A54AB55CdB2", "Jonah"],
  ["0xDC40CbF86727093c52582405703e5b97D5C64B66", "Mason"],
  ["0x2CB8636240693B445ac98F2091b58A898e35e60B", "Joe//Osprey"],
  // ["", "Will"],
  // ["", "Sterling"],
]);
export function Tank({ tank, tankId }: typeof ITank) {
  let { address } = useAccount();
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger>
          <Image
            src={`/logos/tank${
              tank.hearts <= 0 ? 3 : tank.owner == address ? 1 : 2
            }.png`}
            style={{ objectFit: "contain" }}
            width={200}
            height={200}
            alt="tank"
          />
        </HoverCardTrigger>
        <HoverCardContent className="w-full">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                Tank {tankId.toString()}
              </h4>
              <div className="flex items-center pt-2">
                <User className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">Owner {tank.owner.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <User className="mr-2 h-4 w-4 " />
                <span className="text-xs">
                  {OWNERS.get(tank.owner.toString())}
                </span>
              </div>
              <div className="flex items-center pt-2">
                <Heart className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">Hearts {tank.hearts.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <Zap className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">APs: {tank.aps.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <Target className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">Range: {tank.range.toString()}</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
