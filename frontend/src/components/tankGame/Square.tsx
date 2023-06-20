import {
  usePrepareTankGameMove,
  useTankGameMove,
  usePrepareTankGameUpgrade,
  useTankGameUpgrade,
  useTankGameShoot,
  usePrepareTankGameShoot,
  usePrepareTankGameGive,
  useTankGameGive,
  usePrepareTankGameDrip,
  useTankGameDrip,
} from "@/src/generated";
import { useState } from "react";
import { Tank } from "./Tank";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { ITank } from "./ITank";

interface SquareProps {
  x: number;
  y: number;
  boardSize: number;
  tank: typeof ITank | undefined;
  ownersTankId: bigint | undefined;
}
export function Square(props: SquareProps) {
  let [open, setOpen] = useState(false);
  return (
    <div>
      <DropdownMenu onOpenChange={(o) => setOpen(o)}>
        <DropdownMenuTrigger asChild>
          <div
            className={`border w-full h-0 shadow-sm aspect-w-1 aspect-h-1 rounded-sm ${
              open ? "bg-green-200" : "bg-ay-100"
            }`}
          >
            {props.tank && (
              <Tank
                tank={props.tank.tank}
                tankId={props.tank.tankId}
                position={props.tank.position}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        {!props.tank && (
          <EmptySquareMenu
            open={open}
            ownersTank={props.ownersTankId!}
            x={props.x}
            y={props.y}
          />
        )}
        {props.tank && props.tank.tankId === props.ownersTankId && (
          <SelfSquareMenu open={open} ownersTank={props.ownersTankId!} />
        )}
        {props.tank && props.tank.tankId !== props.ownersTankId && (
          <EnemySquareMenu
            ownersTank={props.ownersTankId!}
            open={open}
            enemyTank={props.tank.tankId!}
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
