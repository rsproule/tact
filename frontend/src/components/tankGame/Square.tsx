import {
  useTankGameTanksOnBoard,
  useTankGameTanks,
  usePrepareTankGameMove,
  useTankGameMove,
  usePrepareTankGameUpgrade,
  useTankGameUpgrade,
  useTankGamePlayers,
  useTankGameShoot,
  usePrepareTankGameShoot,
  usePrepareTankGameGive,
  useTankGameGive,
  usePrepareTankGameDrip,
  useTankGameDrip,
  useTankGameTankToPosition,
  useTankGameGetDistance,
} from "@/src/generated";
import { Dispatch, SetStateAction, useState } from "react";
import { Tank } from "./Tank";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  GiftIcon,
  HeartHandshake,
  Move,
  Rocket,
  Crosshair,
  Droplet,
} from "lucide-react";
import { useAccount } from "wagmi";

interface SquareProps {
  x: number;
  y: number;
  boardSize: number;
}
export function Square(props: SquareProps) {
  let [open, setOpen] = useState(false);
  const { address } = useAccount();
  let tankId = useTankGameTanksOnBoard({
    args: [BigInt(props.x + props.y * props.boardSize)],
    watch: true,
  });

  let tank = useTankGameTanks({
    args: [tankId.data!],
    // watch: true,
    enabled: tankId.data != BigInt(0),
  });

  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  let { config } = usePrepareTankGameMove({
    args: [ownersTankId.data!, { x: BigInt(props.x), y: BigInt(props.y) }],
    enabled: !!(ownersTankId.data! && props.x && props.y),
  });
  const { write: move } = useTankGameMove(config);
  let ownersTank = useTankGameTanks({
    args: [ownersTankId.data!],
    enabled: !!ownersTankId.data,
  });

  // let distanceFromOwner = useTankGameGetDistance({
  //   args: [ownersTankId.data!, { x: BigInt(props.x), y: BigInt(props.y) }],
  //   enabled: !!ownersTankId.data,
  //   watch: true,
  //   cacheTime: 0
  // });

  return (
    <div>
      <DropdownMenu onOpenChange={(o) => setOpen(o)}>
        <DropdownMenuTrigger asChild>
          <div
            className={`border w-full h-0 shadow-sm aspect-w-1 aspect-h-1 rounded-sm ${
              move ? "bg-green-200" : "bg-gray-100"
            }`}
          >
            {tank.data && (
              <Tank
                tankId={tankId.data!}
                owner={tank.data[0]}
                hearts={tank.data[1]}
                aps={tank.data[2]}
                range={tank.data[3]}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        {!tank.data && (
          <EmptySquareMenu
            open={open}
            ownersTank={ownersTankId.data!}
            x={props.x}
            y={props.y}
          />
        )}
        {tank.data && tank.data![0] === address && (
          <SelfSquareMenu open={open} ownersTank={ownersTankId.data!} />
        )}
        {tank.data && tank.data![0] !== address && (
          <EnemySquareMenu
            ownersTank={ownersTankId.data!}
            open={open}
            enemyTank={tankId.data!}
          />
        )}
      </DropdownMenu>
    </div>
  );
}

function EnemySquareMenu({
  ownersTank,
  enemyTank,
  open,
}: {
  ownersTank: bigint | undefined;
  enemyTank: bigint | undefined;
  open: boolean;
}) {
  let { config: shootConfig } = usePrepareTankGameShoot({
    args: [ownersTank!, enemyTank!],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: shoot } = useTankGameShoot(shootConfig);

  let { config: giftHeartConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(1), BigInt(0)],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: giveHeart } = useTankGameGive(giftHeartConfig);
  let { config: giveAPConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(0), BigInt(1)],
    enabled: open && !!ownersTank && !!enemyTank,
  });
  const { write: giveAp } = useTankGameGive(giveAPConfig);
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={!shoot} onSelect={() => shoot?.()}>
          <Crosshair className="mr-2 h-4 w-4" />
          <span>Shoot</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!giveHeart} onSelect={() => giveHeart?.()}>
          <HeartHandshake className="mr-2 h-4 w-4" />
          <span>Give heart</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!giveAp} onSelect={() => giveAp?.()}>
          <GiftIcon className="mr-2 h-4 w-4" />
          <span>Give AP</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function EmptySquareMenu({
  ownersTank,
  x,
  y,
  open,
}: {
  ownersTank: bigint;
  x: number;
  y: number;
  open: boolean;
}) {
  let { config } = usePrepareTankGameMove({
    args: [ownersTank, { x: BigInt(x), y: BigInt(y) }],
    enabled: open && !!(ownersTank && x && y),
  });
  const { write: move } = useTankGameMove(config);
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={!move} onSelect={() => move?.()}>
          <Move className="mr-2 h-4 w-4" />
          <span>Move here</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function SelfSquareMenu({
  ownersTank,
  open,
}: {
  ownersTank: bigint;
  open: boolean;
}) {
  let { config: upgradeConfig } = usePrepareTankGameUpgrade({
    args: [ownersTank],
    enabled: open && !!ownersTank,
  });
  const { write: upgrade } = useTankGameUpgrade(upgradeConfig);

  let { config: dripConfig } = usePrepareTankGameDrip({
    args: [ownersTank],
    enabled: open && !!ownersTank,
  });
  const { write: drip } = useTankGameDrip(dripConfig);
  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuItem disabled={!upgrade} onSelect={() => upgrade?.()}>
          <Rocket className="mr-2 h-4 w-4" />
          <span>Upgrade Range</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!drip} onSelect={() => drip?.()}>
          <Droplet className="mr-2 h-4 w-4" />
          <span>Claim APs</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
