import { useState } from "react";
import { Tank } from "./Tank";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ITank } from "./ITank";
import EmptySquareMenu from "./actions/EmptySquareMenu";
import EnemySquareMenu from "./actions/EnemySquareMenu";
import SelfSquareMenu from "./actions/SelfSquareMenu";
import { Hexagon, Pattern } from "react-hexgrid";

interface TileProps {
  x: number;
  y: number;
  z: number;
  selected: boolean;
  boardSize: number;
  tank: typeof ITank | undefined;
  ownersTankId: bigint | undefined;
  isShootRange: boolean;
  isMoveRange: boolean;
  onClick: () => void;
}
export function Tile(props: TileProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [position2, setPosition2] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleChange = () => {
    setOpen(!open);
  };

  const handleClick = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    console.log("rect", rect);
    setPosition({
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    });
    setOpen(true);
  };
  const handleContextMenu = (
    event: React.MouseEvent<SVGGElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // console.log("rect", rect);
    setPosition2({
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    });
    setHover(true);
  };
  return (
    <DropdownMenu open={open} onOpenChange={handleChange}>
      {props.tank && (
        <Tank
          onChange={() => setHover(!hover)}
          tankObj={props.tank}
          open={hover}
          position={position2}
        />
      )}
      <Hexagon
        onClick={(e) => {
          console.log("e", e);
          props.onClick();
          handleClick(e);
        }}
        // onMouseEnter={handleMouseEnter}
        onContextMenu={(e) => {
          // console.log("e", e);
          e.preventDefault();
          handleContextMenu(e);
        }}
        q={props.x}
        r={props.y}
        s={props.z}
        fill={
          props.tank && props.tank?.tankId === props.ownersTankId
            ? "owner"
            : props.tank
            ? "enemy"
            : ""
        }
      />
      {position && (
        <DropdownMenuContent
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
          }}
          className="w-56"
        >
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
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

function getFill(selected: boolean, shootRange: boolean, moveRange: boolean) {}
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
