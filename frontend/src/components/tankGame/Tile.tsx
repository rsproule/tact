import { useState } from "react";
import { Tank } from "./Tank";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ITank } from "./ITank";
import EmptySquareMenu from "./actions/EmptySquareMenu";
import EnemySquareMenu from "./actions/EnemySquareMenu";
import SelfSquareMenu from "./actions/SelfSquareMenu";
import { Hexagon } from "react-hexgrid";

interface TileProps {
  x: number;
  y: number;
  z: number;
  boardSize: number;
  tank: typeof ITank | undefined;
  ownersTankId: bigint | undefined;
  isShootRange: boolean;
  isMoveRange: boolean;
  onClick: () => void;
}
export function Tile(props: TileProps) {
  let [open, setOpen] = useState(false);
  return (
    <DropdownMenu
      onOpenChange={(o) => {
        console.log(o);
        setOpen(o);
        props.onClick();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Hexagon
          onClick={() => {
            console.log("clicked");
          }}
          q={Number(props.x)}
          r={Number(props.y)}
          s={Number(props.z)}
        >
          {props.tank && (
            <Tank
              tank={props.tank.tank}
              tankId={props.tank.tankId}
              position={props.tank.position}
            />
          )}
        </Hexagon>
        {/* <div
          className={`border w-full h-0 shadow-sm aspect-w-1 aspect-h-1 rounded-sm ${getColor(
            open,
            props.isShootRange,
            props.isMoveRange
          )}`}
        >
          {props.tank && (
            <Tank
              tank={props.tank.tank}
              tankId={props.tank.tankId}
              position={props.tank.position}
            />
          )}
        </div> */}
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
  );
}

function getColor(selected: boolean, shootRange: boolean, moveRange: boolean) {
  if (selected) {
    return "bg-green-200";
  }
  if (shootRange && moveRange) {
    return "bg-orange-200";
  }
  if (shootRange) {
    return "bg-red-200";
  }
  if (moveRange) {
    return "bg-gray-200";
  }
  return "bg-gray-500";
}
