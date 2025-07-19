import { useState, MouseEvent } from "react";
import { Hexagon } from "react-hexgrid";
import { GameId } from '@tact/game-logic';
import { TankInfo } from './TankInfo.js';
import { EmptySquareMenu } from './actions/EmptySquareMenu.js';
import { EnemySquareMenu } from './actions/EnemySquareMenu.js';
import { SelfSquareMenu } from './actions/SelfSquareMenu.js';
import { ContextMenu } from './actions/ContextMenu.js';

interface TileProps {
  x: number;
  y: number;
  z: number;
  distance: number | undefined;
  selected: boolean;
  highlighted: boolean;
  boardSize: number;
  tank: any | undefined;
  heartsOnTile: number | undefined;
  ownerTank: any | undefined;
  isShootRange: boolean;
  isMoveRange: boolean;
  onClick: () => void;
  onContextClick: () => void;
  gameId: GameId;
}

export function Tile(props: TileProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [position, setPosition] = useState<{
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
  
  const handleContextMenu = () => {
    setHover(true);
    props.onContextClick();
  };

  const getTileColor = () => {
    if (props.selected) {
      return "fill-green-200";
    }
    if (props.highlighted) {
      return "fill-orange-200";
    }
    if (props.isShootRange && props.isMoveRange) {
      return "fill-orange-200";
    }
    if (props.isShootRange) {
      return "fill-red-200";
    }
    if (props.isMoveRange) {
      return "fill-blue-200";
    }
    return "fill-gray-400";
  };

  const getTileFill = () => {
    if (props.tank) {
      if (props.tank.hearts === 0) {
        return "dead";
      } else if (props.tank === props.ownerTank || props.tank.owner === props.ownerTank?.owner) {
        return "owner";
      } else {
        return "enemy";
      }
    } else if (props.heartsOnTile && props.heartsOnTile > 0) {
      return "heart";
    }
    return "";
  };

  return (
    <ContextMenu open={open} onOpenChange={handleChange}>
      {props.tank && (
        <TankInfo
          tank={props.tank}
          hex={{ q: props.x, r: props.y, s: props.z }}
          isOwner={props.tank.tankId === props.ownerTank?.tankId}
          show={hover}
        />
      )}
      <Hexagon
        onClick={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
          props.onClick();
          handleClick(e);
        }}
        onContextMenu={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
          e.preventDefault();
          handleContextMenu();
        }}
        onDoubleClick={(e: React.MouseEvent<SVGGElement, MouseEvent>) => {
          e.preventDefault();
          handleContextMenu();
        }}
        q={props.x}
        r={props.y}
        s={props.z}
        className={getTileColor()}
        fill={getTileFill() || undefined}
      />
      {position && (
        <div
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 1000,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            minWidth: "224px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
        >
          {!props.tank && (
            <EmptySquareMenu
              gameId={props.gameId}
              distance={props.distance}
              ownerTank={props.ownerTank}
              targetPosition={{ x: props.x, y: props.y, z: props.z }}
              onClose={() => setOpen(false)}
            />
          )}
          {props.tank && props.tank.tankId === props.ownerTank?.tankId && (
            <SelfSquareMenu
              gameId={props.gameId}
              ownerTank={props.ownerTank}
              onClose={() => setOpen(false)}
            />
          )}
          {props.tank && props.tank.tankId !== props.ownerTank?.tankId && (
            <EnemySquareMenu
              gameId={props.gameId}
              ownerTank={props.ownerTank}
              enemyTank={props.tank}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </ContextMenu>
  );
}