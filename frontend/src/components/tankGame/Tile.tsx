import { useState } from "react";
import { Tank } from "./Tank";
import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";
import { ITank } from "./ITank";
import EmptySquareMenu from "./actions/EmptySquareMenu";
import EnemySquareMenu from "./actions/EnemySquareMenu";
import SelfSquareMenu from "./actions/SelfSquareMenu";
import { Hexagon } from "react-hexgrid";

interface TileProps {
  x: number;
  y: number;
  z: number;
  selected: boolean;
  boardSize: number;
  tank: typeof ITank | undefined;
  heartsOnTile: bigint | undefined;
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
          props.onClick();
          handleClick(e);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          handleContextMenu(e);
        }}
        q={props.x}
        r={props.y}
        s={props.z}
        className={`${getColor(
          props.selected,
          props.isShootRange,
          props.isMoveRange
        )}`}
        fill={
          props.tank
            ? props.tank.tank.hearts === BigInt(0)
              ? "dead"
              : props.tank && props.tank?.tankId === props.ownersTankId
              ? "owner"
              : "enemy"
            : props.heartsOnTile && props.heartsOnTile > 0
            ? "heart"
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
              z={props.z}
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

function getColor(selected: boolean, shootRange: boolean, moveRange: boolean) {
  if (selected) {
    return "fill-green-200";
  }
  if (shootRange && moveRange) {
    return "fill-orange-200";
  }
  if (shootRange) {
    return "fill-red-200";
  }
  if (moveRange) {
    return "fill-blue-200";
  }
  return "fill-gray-400";
}
