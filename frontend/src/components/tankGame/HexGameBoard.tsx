import { Tile } from "./Tile";
import { HexGrid, Layout, Hexagon, Hex } from "react-hexgrid";

import { useTankGamePlayers } from "@/src/generated";
import { useState } from "react";
import { useAccount } from "wagmi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function HexBoard({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedTank, setSelectedTank] = useState<any>();
  // let tanks = useTankGameGetAllTanks({ watch: true });
  const { address } = useAccount();
  let ownersTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  // if (!boardSize) {
  // const a = new Array(Number(boardSize! + BigInt(1))).fill(0);

  if (!boardSize) {
    return <div></div>;
  }
  const a = hexagon(Number(boardSize!));
  return (
    <div className="container border">
      {/* <TransformWrapper>
        <TransformComponent> */}
      <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
        <Layout
          size={{ x: 1, y: 1 }}
          flat={false}
          spacing={1}
          origin={{ x: 0, y: 0 }}
        >
          {a.map((hex, i) => {
            return (
              // <Hexagon
              //   onClick={() => {
              //     console.log("clicked");
              //   }}
              //   key={i}
              //   q={Number(hex.q)}
              //   r={Number(hex.r)}
              //   s={Number(hex.s)}
              // >
              <Tile
                key={i}
                x={hex.q}
                y={hex.r}
                z={hex.s}
                boardSize={0}
                tank={undefined}
                ownersTankId={undefined}
                isShootRange={false}
                isMoveRange={false}
                onClick={function (): void {
                  // alert("clicked");
                }}
              />
              // </Hexagon>
            );
          })}
        </Layout>
      </HexGrid>
      {/* </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
  // }
  // return boardSize !== BigInt(0) && <div></div>;
}

function totalTilesFromRadius(radius: number) {
  return 3 * radius * (radius - 1) + 1;
}
function getDistance(ax: bigint, ay: bigint, bx: bigint, by: bigint) {
  const x = ax > bx ? ax - bx : bx - ax;
  const y = ay > by ? ay - by : by - ay;
  return x > y ? x : y;
}

function indexToPoint(index: number, boardSize: number) {
  let idx = 0;
  for (let q = 0; q <= boardSize; q++) {
    let r1 = Math.max(0, boardSize - q - boardSize / 2);
    let r2 = Math.min(boardSize, boardSize - q + boardSize / 2);

    for (let r = r1; r <= r2; r++) {
      if (idx === Number(index)) {
        return new Hex(q, r, boardSize - q - r);
      }
      idx++;
    }
  }
  console.log("indexToPoint: index not found: ", index);
  return new Hex(0, 0, 0);
}

function hexagon(mapRadius: number): Hex[] {
  let hexas: Hex[] = [];
  for (let q = -mapRadius; q <= mapRadius; q++) {
    let r1 = Math.max(-mapRadius, -q - mapRadius);
    let r2 = Math.min(mapRadius, -q + mapRadius);
    for (let r = r1; r <= r2; r++) {
      hexas.push(new Hex(q, r, -q - r));
    }
  }
  return hexas;
}
