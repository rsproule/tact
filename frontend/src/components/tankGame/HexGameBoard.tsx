import { Tile } from "./Tile";
import { HexGrid, Layout, Hexagon, Hex, Pattern } from "react-hexgrid";

import { useGameViewGetAllTanks, useTankGamePlayers } from "@/src/generated";
import { useState } from "react";
import { useAccount } from "wagmi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as ContextMenu from "@radix-ui/react-context-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

export function HexBoard({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedTank, setSelectedTank] = useState<any>();
  const [selectedTile, setSelectedTile] = useState<any>();
  let tanks = useGameViewGetAllTanks();
  console.log("tanks", tanks.data);
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });

  if (!boardSize) {
    return <div></div>;
  }
  const a = hexagon(Number(boardSize!));
  return (
    <div className="container border">
      <TransformWrapper>
        <TransformComponent>
          <HexGrid width={1200} height={800} viewBox="-20 -20 100 100">
            <Pattern id="owner" link="/logos/tank1.png" size={{ x: 1, y: 1 }} />
            <Pattern id="enemy" link="/logos/tank2.png" size={{ x: 1, y: 1 }} />
            <Pattern id="dead" link="/logos/tank3.png" size={{ x: 1, y: 1 }} />

            <Layout
              size={{ x: 1, y: 1 }}
              flat={false}
              spacing={1}
              origin={{ x: 0, y: 0 }}
            >
              {a.map((hex, i) => {
                const tank = tanks.data?.find((tank) => {
                  return (
                    tank.position.x === BigInt(hex.q) &&
                    tank.position.y === BigInt(hex.r) &&
                    tank.position.z === BigInt(hex.s)
                  );
                });
                return (
                  <Tile
                    key={i}
                    x={Number(hex.q)}
                    y={Number(hex.r)}
                    z={Number(hex.s)}
                    selected={false}
                    boardSize={40}
                    tank={tank}
                    ownersTankId={ownersTankId.data!}
                    isShootRange={false}
                    isMoveRange={false}
                    onClick={function (): void {
                      setSelectedTank(tank);
                      setSelectedTile(hex);
                    }}
                  />
                );
              })}
            </Layout>
          </HexGrid>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

function totalTilesFromRadius(radius: number) {
  return 3 * radius * (radius - 1) + 1;
}

// function indexToPoint(index: number, boardSize: number) {
//   let idx = 0;
//   for (let q = 0; q <= boardSize; q++) {
//     let r1 = Math.max(0, boardSize - q - boardSize / 2);
//     let r2 = Math.min(boardSize, boardSize - q + boardSize / 2);

//     for (let r = r1; r <= r2; r++) {
//       if (idx === Number(index)) {
//         return new Hex(q, r, boardSize - q - r);
//       }
//       idx++;
//     }
//   }
//   console.log("indexToPoint: index not found: ", index);
//   return new Hex(0, 0, 0);
// }

function hexagon(mapRadius: number): Hex[] {
  let hexas: Hex[] = [];
  for (let q = -mapRadius; q <= mapRadius; q++) {
    let r1 = Math.max(-mapRadius, -q - mapRadius);
    let r2 = Math.min(mapRadius, -q + mapRadius);
    for (let r = r1; r <= r2; r++) {
      hexas.push(new Hex(mapRadius + q, mapRadius + r, mapRadius - q - r));
    }
  }
  return hexas;
}

// function hexas_bf(boardSize: number): Hex[] {
//   const validPoints: Hex[] = [];
//   for (let x = 0; x <= 2 * boardSize; x++) {
//     for (let y = 0; y <= 2 * boardSize; y++) {
//       for (let z = 0; z <= 2 * boardSize; z++) {
//         const point = new Hex(x, y, z);
//         if (
//           point.q + point.r + point.s === 2*boardSize &&
//           _getDistance(point, new Hex(boardSize, boardSize, boardSize)) <=
//             boardSize*2
//         ) {
//           validPoints.push(point);
//         }
//       }
//     }
//   }
//   return validPoints;
// }

// function getDistance(a: Hex, b: Hex): number {
//   let dx = a.q > b.q ? a.q - b.q : b.q - a.q;
//   let dy = a.r > b.r ? a.r - b.r : b.r - a.r;
//   let dz = a.s > b.s ? a.s - b.s : b.s - a.s;
//   return (dx + dy + dz) / 2;
// }
