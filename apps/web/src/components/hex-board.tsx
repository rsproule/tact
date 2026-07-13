"use client";

import { useMemo } from "react";

import type { BoardResource, GameView, HexCoordinate, PlayerView } from "./game-client";

type BoardSelection = Readonly<{
  coordinate: HexCoordinate;
  player?: PlayerView;
  resource?: BoardResource;
}>;

type HexBoardProps = Readonly<{
  game: GameView;
  selfPlayer?: PlayerView;
  selected?: HexCoordinate;
  onSelect: (selection: BoardSelection) => void;
}>;

const HEX_SIZE = 40;
const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
const HEX_STEP_Y = HEX_SIZE * 1.5;

export function HexBoard({ game, selfPlayer, selected, onSelect }: HexBoardProps) {
  const radius = Math.max(1, Math.min(14, game.config.boardSize));
  const cells = useMemo(() => createHexagon(radius), [radius]);
  const playerByCell = useMemo(
    () => new Map(game.players.map((player) => [hexKey(player.position), player])),
    [game.players],
  );
  const resourceByCell = useMemo(
    () => new Map(game.resources.map((resource) => [hexKey(resource.position), resource])),
    [game.resources],
  );

  const pixelCells = useMemo(
    () =>
      cells.map((coordinate) => ({
        coordinate,
        x: HEX_WIDTH * (coordinate.q + coordinate.r / 2),
        y: HEX_STEP_Y * coordinate.r,
      })),
    [cells],
  );
  const extents = pixelCells.reduce(
    (accumulator, cell) => ({
      minX: Math.min(accumulator.minX, cell.x - HEX_WIDTH / 2),
      maxX: Math.max(accumulator.maxX, cell.x + HEX_WIDTH / 2),
      minY: Math.min(accumulator.minY, cell.y - HEX_SIZE),
      maxY: Math.max(accumulator.maxY, cell.y + HEX_SIZE),
    }),
    { minX: 0, maxX: 0, minY: 0, maxY: 0 },
  );
  const padding = HEX_SIZE * 1.6;
  const viewBox = [
    extents.minX - padding,
    extents.minY - padding,
    extents.maxX - extents.minX + padding * 2,
    extents.maxY - extents.minY + padding * 2,
  ].join(" ");

  return (
    <div className="board-shell">
      <div className="board-grid" aria-hidden="true" />
      <svg
        className="hex-board"
        viewBox={viewBox}
        role="grid"
        aria-label={`Hex board, radius ${game.config.boardSize}`}
      >
        {pixelCells.map(({ coordinate, x, y }) => {
          const player = playerByCell.get(hexKey(coordinate));
          const resource = resourceByCell.get(hexKey(coordinate));
          const isSelf = Boolean(player && selfPlayer && player.id === selfPlayer.id);
          const distance = selfPlayer ? hexDistance(selfPlayer.position, coordinate) : undefined;
          const inMoveRange = Boolean(
            selfPlayer &&
              selfPlayer.state === "alive" &&
              !player &&
              distance !== undefined &&
              distance > 0 &&
              distance <= selfPlayer.actionPoints,
          );
          const inTargetRange = Boolean(
            selfPlayer &&
              player &&
              player.id !== selfPlayer.id &&
              distance !== undefined &&
              distance <= selfPlayer.range,
          );
          const isSelected = selected ? sameHex(selected, coordinate) : false;
          const cellClass = [
            "hex-cell",
            isSelected ? "is-selected" : "",
            inMoveRange ? "in-move-range" : "",
            inTargetRange ? "in-target-range" : "",
            player ? "is-occupied" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <g
              className={cellClass}
              key={hexKey(coordinate)}
              transform={`translate(${x} ${y})`}
              role="gridcell"
              tabIndex={0}
              aria-label={cellLabel(coordinate, player, resource, distance)}
              onClick={() => onSelect({ coordinate, player, resource })}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect({ coordinate, player, resource });
                }
              }}
            >
              <polygon className="hex-hit" points={hexPoints(HEX_SIZE)} />
              <polygon className="hex-face" points={hexPoints(HEX_SIZE - 2)} />

              {resource && !player ? (
                <g className="resource-marker" aria-hidden="true">
                  <circle r="13" />
                  <path d="M0 8C-14-1-8-12 0-6C8-12 14-1 0 8Z" />
                  {resource.quantity > 1 ? <text x="13" y="-11">×{resource.quantity}</text> : null}
                </g>
              ) : null}

              {player ? (
                <g
                  className={`tank-marker ${isSelf ? "is-self" : "is-rival"} ${
                    player.state === "dead" ? "is-dead" : ""
                  }`}
                  aria-hidden="true"
                >
                  <circle className="tank-ring" r="20" />
                  <path className="tank-body" d="M-13 8V-7H13V8ZM-7-8V-15H7V-8ZM0-15V-25" />
                  <circle className="tank-core" r="4" />
                  <text className="tank-seat" y="4">{player.seat}</text>
                  {player.state === "dead" ? <path className="dead-mark" d="M-13-13 13 13M13-13-13 13" /> : null}
                  <text className="tank-name" y="34">{shortName(player.handle)}</text>
                  <text className="tank-vitals" y="46">{player.hearts}♥ · {player.actionPoints}AP</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="board-legend" aria-label="Board legend">
        <span><i className="legend-swatch move" /> Move</span>
        <span><i className="legend-swatch target" /> Range</span>
        <span><i className="legend-swatch selected" /> Selected</span>
      </div>
    </div>
  );
}

export function hexDistance(a: HexCoordinate, b: HexCoordinate): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.s - b.s)) / 2;
}

export function hexKey(coordinate: HexCoordinate): string {
  return `${coordinate.q}:${coordinate.r}:${coordinate.s}`;
}

function createHexagon(radius: number): HexCoordinate[] {
  const coordinates: HexCoordinate[] = [];
  for (let q = -radius; q <= radius; q += 1) {
    const minR = Math.max(-radius, -q - radius);
    const maxR = Math.min(radius, -q + radius);
    for (let r = minR; r <= maxR; r += 1) {
      coordinates.push({ q, r, s: -q - r });
    }
  }
  return coordinates;
}

function hexPoints(size: number): string {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = ((60 * index - 30) * Math.PI) / 180;
    return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
  }).join(" ");
}

function sameHex(a: HexCoordinate, b: HexCoordinate): boolean {
  return a.q === b.q && a.r === b.r && a.s === b.s;
}

function shortName(value: string): string {
  return value.length > 11 ? `${value.slice(0, 10)}…` : value;
}

function cellLabel(
  coordinate: HexCoordinate,
  player?: PlayerView,
  resource?: BoardResource,
  distance?: number,
): string {
  const contents = player
    ? `${player.handle}, ${player.state}, ${player.hearts} hearts, ${player.actionPoints} AP`
    : resource
      ? `${resource.quantity} ${resource.kind}`
      : "empty";
  return `Hex ${coordinate.q}, ${coordinate.r}, ${coordinate.s}; ${contents}${
    distance === undefined ? "" : `; distance ${distance}`
  }`;
}

export type { BoardSelection };
