import { useState } from "react";
import { Tank } from "./Tank";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ITank } from "./ITank";
import EmptySquareMenu from "./actions/EmptySquareMenu";
import EnemySquareMenu from "./actions/EnemySquareMenu";
import SelfSquareMenu from "./actions/SelfSquareMenu";

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
              open ? "bg-green-200" : "bg-gray-600"
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

