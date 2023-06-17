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
  selected: boolean;
  setSelected: Dispatch<SetStateAction<{ x: bigint; y: bigint } | undefined>>;
}
export function Square(props: SquareProps) {
  const { address } = useAccount();
  let tankId = useTankGameTanksOnBoard({
    args: [BigInt(props.x + props.y * 10)],
    watch: true,
  });

  let tank = useTankGameTanks({
    args: [tankId.data!],
    watch: true,
    enabled: tankId.data != BigInt(0),
  });

  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });

  let ownersTank = useTankGameTanks({
    args: [ownersTankId.data!],
    enabled: !!ownersTankId.data,
  });

  let distanceFromOwner = useTankGameGetDistance({
    args: [ownersTankId.data!, { x: BigInt(props.x), y: BigInt(props.y) }],
    enabled: !!ownersTankId.data,
    watch: true,
    cacheTime: 0
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`border w-full h-0 shadow-sm aspect-w-1 aspect-h-1 rounded-sm ${
            // distanceFromOwner.data &&
            // ownersTank.data &&
            // distanceFromOwner.data! < ownersTank.data![3]
            //   ? "bg-green-200"
            "bg-gray-100"
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
          ownersTank={ownersTankId.data!}
          x={props.x}
          y={props.y}
        />
      )}
      {tank.data && tank.data![0] === address && (
        <SelfSquareMenu ownersTank={ownersTankId.data!} />
      )}
      {tank.data && tank.data![0] !== address && (
        <EnemySquareMenu
          ownersTank={ownersTankId.data!}
          enemyTank={tankId.data!}
          distanceFromOwner={distanceFromOwner.data}
          ownerTankRange={ownersTank.data && ownersTank.data![3]}
        />
      )}
    </DropdownMenu>
  );
}

function EnemySquareMenu({
  ownersTank,
  enemyTank,
  distanceFromOwner,
  ownerTankRange,
}: {
  ownersTank: bigint | undefined;
  enemyTank: bigint | undefined;
  distanceFromOwner: bigint | undefined;
  ownerTankRange: bigint | undefined;
}) {
  let { config: shootConfig } = usePrepareTankGameShoot({
    args: [ownersTank!, enemyTank!],
    enabled:
      !!ownersTank &&
      !!enemyTank &&
      !!distanceFromOwner &&
      !!ownerTankRange &&
      distanceFromOwner! <= ownerTankRange!,
  });
  const { write: shoot } = useTankGameShoot(shootConfig);

  let { config: giftHeartConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(1), BigInt(0)],
    enabled:
      !!ownersTank &&
      !!enemyTank &&
      !!distanceFromOwner &&
      !!ownerTankRange &&
      distanceFromOwner! <= ownerTankRange!,
  });
  const { write: giveHeart } = useTankGameGive(giftHeartConfig);
  let { config: giveAPConfig } = usePrepareTankGameGive({
    args: [ownersTank!, enemyTank!, BigInt(0), BigInt(1)],
    enabled:
      !!ownersTank &&
      !!enemyTank &&
      !!distanceFromOwner &&
      !!ownerTankRange &&
      distanceFromOwner! <= ownerTankRange!,
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
}: {
  ownersTank: bigint;
  x: number;
  y: number;
}) {
  let { config } = usePrepareTankGameMove({
    args: [ownersTank, { x: BigInt(x), y: BigInt(y) }],
    enabled: !!(ownersTank && x && y),
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

function SelfSquareMenu({ ownersTank }: { ownersTank: bigint }) {
  let { config: upgradeConfig } = usePrepareTankGameUpgrade({
    args: [ownersTank],
    enabled: !!ownersTank,
  });
  const { write: upgrade } = useTankGameUpgrade(upgradeConfig);

  let { config: dripConfig } = usePrepareTankGameDrip({
    args: [ownersTank],
    enabled: !!ownersTank,
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
