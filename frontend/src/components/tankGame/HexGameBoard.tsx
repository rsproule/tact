import { Tile } from "./Tile";
import { HexGrid, Layout, Hex, Pattern } from "react-hexgrid";

import { useGameViewGetAllTanks, useTankGamePlayers } from "@/src/generated";
import { useState } from "react";
import { useAccount } from "wagmi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ITank } from "./ITank";

export function HexBoard({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedTank, setSelectedTank] = useState<typeof ITank | undefined>();
  const [selectedTile, setSelectedTile] = useState<Hex | undefined>();
  let tanks = useGameViewGetAllTanks({ watch: true });
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
          <HexGrid width={1200} height={1200} viewBox="0 -10 140 140">
            <Pattern id="owner" link="/logos/tank1.png" size={{ x: 1, y: 1 }} />
            <Pattern id="enemy" link="/logos/tank2.png" size={{ x: 1, y: 1 }} />
            <Pattern id="dead" link="/logos/tank3.png" size={{ x: 1, y: 1 }} />

            <Layout size={{ x: 1, y: 1 }} flat={false} origin={{ x: 0, y: 0 }}>
              {a.map((hex, i) => {
                // TODO: performance improvement here by using a diff data structure
                // instead of a find
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
                    selected={
                      !!selectedTile &&
                      selectedTile!.q === hex.q &&
                      selectedTile!.r === hex.r &&
                      selectedTile!.s === hex.s
                    }
                    boardSize={40}
                    tank={tank}
                    ownersTankId={ownersTankId.data!}
                    isShootRange={
                      !!selectedTank &&
                      selectedTank.tank.hearts > 0 &&
                      getDistance(selectedTile!, hex) <= selectedTank.tank.range
                    }
                    isMoveRange={
                      !!selectedTank &&
                      selectedTank.tank.hearts > 0 &&
                      getDistance(selectedTile!, hex) <= selectedTank.tank.aps
                    }
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

function getDistance(a: Hex, b: Hex): number {
  let dx = a.q > b.q ? a.q - b.q : b.q - a.q;
  let dy = a.r > b.r ? a.r - b.r : b.r - a.r;
  let dz = a.s > b.s ? a.s - b.s : b.s - a.s;
  return (dx + dy + dz) / 2;
}
