import { Droplet, Heart, Target, User, Zap } from "lucide-react";
import { ITank } from "./ITank";
import { useTankGameGetEpoch, useTankGameLastDripEpoch } from "@/src/generated";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { getAddress } from "viem";

export const OWNERS: Map<String, String> = new Map<string, string>([
  [getAddress("0x5337122c6b5ce24D970Ce771510D22Aeaf038C44"), "ryan"],
  [getAddress("0xC15ebb4f1aC7F1C5D94dB64a472e1718fa6b6dEc"), "kinjal"],
  [getAddress("0x3Aab3396Fede536ACCB3a578CD96617092270536"), "yuan"],
  [getAddress("0x0ba85c9e1863E5efB8395a55cd042d61DECD6e89"), "anay"],
  [getAddress("0x259A3AB4A06d647380B046249ef3b12dB212Dc3e"), "spencer"],
  [getAddress("0x3FB9a5F2158716a2eD1AAFc4539E5A24feB2E4a8"), "jay"],
  [getAddress("0x2FC7C69FdcCEa8ab0AC395d180B07F6E93Db1B4d"), "joshua"],
  [getAddress("0xE0E9A1807802a32544570832Fe5a21Ea09500872"), "shishi"],
  [getAddress("0x859B7FA9b70746720bdeA1453D04161F3C829684"), "yigit"],
  [getAddress("0x9f90a3C2c1938F248241414754d977B897Fb3Fc5"), "sterling"],
  [getAddress("0x2cb8636240693b445ac98f2091b58a898e35e60b"), "joe"],
  [getAddress("0xb7430de9B4D8e5cDB951019d7651cD5fda630498"), "sam"],
  [getAddress("0xb100d1E55c42a72a28fbA012bB77aD9a497358b8"), "mason"],
  [getAddress("0xac56Bf73E73e252e962958B856d88F8264A2F2Ab"), "daniel"],
  [getAddress("0xbf0E0d8797d31fdDb2073B51eC5F78B56382643f"), "brad"],
  [getAddress("0x1f08eB0a5F08117D3302212139d3804Cf4810de8"), "pat"],
  [getAddress("0x6c915B7d41566fA58b15962D829591edE914Fc34"), "will"],
  [getAddress("0xB3c296170c57A7510Bb95EF2E9C47977bC2FF1c8"), "caleb"],
  [getAddress("0xDA744DaCea631029430FD63D83B26F757E054Cb7"), "brian"],
  [getAddress("0x25C9745e0BA56fa7E40F9F8f61b7Fb49016cf342"), "phil"],
  [getAddress("0x9B6A3e3A2C81464f873e54C07Ed947dd00938802"), "bot0"],
  [getAddress("0xf940C90fb67A3992d55B676746669921457997e4"), "bot1"],
  [getAddress("0xbf69051850247fdc1a8A27c3AD4F7951CE6977b1"), "bot2"],
  [getAddress("0x7950787FE58E6cd7cB902773E8868c7F6F89d8eD"), "bot3"],
  [getAddress("0xA16110c3dC7eEF79806C917ed0Bd7fA497c8580b"), "bot4"],
  [getAddress("0xa192204d0E14233c5c09bB172CE38c2d2d7DDf1B"), "bot5"],
  [getAddress("0xCc110bd48b55D483B19a4dd378B066dA6c3cD1fE"), "bot6"],
  [getAddress("0x7219cA1F7d8045c5c757BaC01d6eC81D43504072"), "bot7"],
  [getAddress("0x60848AFA93C83cA3eA7734E47c3dA155eB78B59B"), "bot8"],
  [getAddress("0xe54B2534F74b857246Bd5854551F1178aa0BeA71"), "bot9"],
  [getAddress("0x0541a3Aa3FA999EFE2596324bfeE79ACf11269Df"), "bot10"],
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
  });
  let currentEpoch = useTankGameGetEpoch();
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
