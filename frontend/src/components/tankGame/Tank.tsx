import { useAccount } from "wagmi";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Heart, Target, User, Zap } from "lucide-react";
import { ITank } from "./ITank";

interface TankProps {
  tankId: bigint;
  owner: `0x${string}`;
  hearts: bigint;
  aps: bigint;
  range: bigint;
}

export function Tank({ tank, tankId }: typeof ITank) {
  let { address } = useAccount();
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger>
          <Image
            src={`/logos/tank${tank.owner == address ? 1 : 2}.png`}
            style={{ objectFit: "contain" }}
            width={200}
            height={200}
            alt="tank"
          />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Tank {tankId.toString()}</h4>
              <div className="flex items-center pt-2">
                <User className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">{tank.owner.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <Heart className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">{tank.hearts.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <Zap className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">{tank.aps.toString()}</span>
              </div>
              <div className="flex items-center pt-2">
                <Target className="mr-2 h-4 w-4 " />{" "}
                <span className="text-xs">{tank.range.toString()}</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
