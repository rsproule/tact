import { Droplet, Heart, Target, User, Zap } from "lucide-react";
import { ITank } from "./ITank";
import { useTankGameGetEpoch, useTankGameLastDripEpoch } from "@/src/generated";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { Address} from "viem";
import { useTankNameFromId } from "./EventsStream";

interface TankProps {
  tankObj: typeof ITank;
  open: boolean;
  position: {
    top: number;
    left: number;
  } | null;
  onChange: () => void;
  address: Address
}
export function Tank({ tankObj, open, position, onChange, address }: TankProps) {
  const { tank, tankId } = tankObj;
  const tankName = useTankNameFromId(address, tankId);
  let lastDripEpoch = useTankGameLastDripEpoch({
    args: [tankId],
    enabled: !!tankId,
    watch: true,
  });
  let currentEpoch = useTankGameGetEpoch({ watch: true });
  return (
    <div>
      <DropdownMenu open={open} onOpenChange={onChange}>
        {position && (
          <DropdownMenuContent
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
            }}
          >
            <div className="flex p-4 justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  Tank {tankId.toString()}
                </h4>
                <div className="flex items-center pt-2">
                  <User className="mr-2 h-4 w-4 " />{" "}
                  <span className="text-xs">
                    Owner address: {tank.owner.toString()}
                  </span>
                </div>
                <div className="flex items-center pt-2">
                  <User className="mr-2 h-4 w-4 " />
                  <span className="text-xs">
                    Owner name: {tankName}
                  </span>
                </div>
                <div className="flex items-center pt-2">
                  <Heart className="mr-2 h-4 w-4 " />{" "}
                  <span className="text-xs">
                    Hearts: {tank.hearts.toString()}
                  </span>
                </div>
                <div className="flex items-center pt-2">
                  <Zap className="mr-2 h-4 w-4 " />{" "}
                  <span className="text-xs">APs: {tank.aps.toString()}</span>
                </div>
                <div className="flex items-center pt-2">
                  <Droplet className="mr-2 h-4 w-4 " />{" "}
                  <span className="text-xs">
                    Claimable APs:{" "}
                    {!!currentEpoch.data &&
                      !!lastDripEpoch.data &&
                      (currentEpoch.data! - lastDripEpoch.data!).toString()}
                  </span>
                </div>
                <div className="flex items-center pt-2">
                  <Target className="mr-2 h-4 w-4 " />{" "}
                  <span className="text-xs">
                    Range: {tank.range.toString()}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
