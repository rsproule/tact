import { Droplet, Heart, Target, User, Zap } from "lucide-react";
import { ITank } from "./ITank";
import { useTankGameGetEpoch, useTankGameLastDripEpoch } from "@/src/generated";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { getAddress } from "viem";

export const OWNERS: Map<String, String> = new Map<string, string>([
  [getAddress("0x5337122c6b5ce24d970ce771510d22aeaf038c44"), "ryan"],
  [getAddress("0xc15ebb4f1ac7f1c5d94db64a472e1718fa6b6dec"), "kinjal"],
  [getAddress("0x3aab3396fede536accb3a578cd96617092270536"), "yuan"],
  [getAddress("0x0ba85c9e1863e5efb8395a55cd042d61decd6e89"), "anay"],
  [getAddress("0x259a3ab4a06d647380b046249ef3b12db212dc3e"), "spencer"],
  [getAddress("0x3fb9a5f2158716a2ed1aafc4539e5a24feb2e4a8"), "jay"],
  [getAddress("0x2fc7c69fdccea8ab0ac395d180b07f6e93db1b4d"), "joshua"],
  [getAddress("0xe0e9a1807802a32544570832fe5a21ea09500872"), "shishi"],
  [getAddress("0x9f90a3c2c1938f248241414754d977b897fb3fc5"), "sterling"],
  [getAddress("0x2cb8636240693b445ac98f2091b58a898e35e60b"), "joe"],
  [getAddress("0x9Ada897d963028923B645d72D01c3beB1343e072"), "sam"],
  [getAddress("0xb100d1e55c42a72a28fba012bb77ad9a497358b8"), "mason"],
  [getAddress("0xac56bf73e73e252e962958b856d88f8264a2f2ab"), "daniel"],
  [getAddress("0x1f08eb0a5f08117d3302212139d3804cf4810de8"), "pat"],
  [getAddress("0x6c915b7d41566fa58b15962d829591ede914fc34"), "will"],
  [getAddress("0xb3c296170c57a7510bb95ef2e9c47977bc2ff1c8"), "caleb"],
  [getAddress("0xda744dacea631029430fd63d83b26f757e054cb7"), "brian"],
  [getAddress("0x14174a3f8868b4b6ab023853e2ff5903ea0fd015"), "carra"],
  [getAddress("0x60de91d489D41FAF4C42F5734fF5E8c95A0990F9"), "hopper"],
  [getAddress("0xA288d0BF9fe24773350394b011f6315Ff04a1025"), "emily"],
  [getAddress("0xD9Fd9E6C91e984F8461e4d15468b77fdff1B1bcd"), "aidan"],
]);
interface TankProps {
  tankObj: typeof ITank;
  open: boolean;
  position: {
    top: number;
    left: number;
  } | null;
  onChange: () => void;
}
export function Tank({ tankObj, open, position, onChange }: TankProps) {
  const { tank, tankId } = tankObj;
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
                    Owner name: {OWNERS.get(tank.owner.toString())}
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
