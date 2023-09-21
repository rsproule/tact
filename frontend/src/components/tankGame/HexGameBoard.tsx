import { Tile } from "./Tile";
import { HexGrid, Layout, Hex, Pattern } from "react-hexgrid";

import {
  useGameViewGetAllHearts,
  useGameViewGetAllTanks,
  useTankGamePlayers,
} from "@/src/generated";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ITank } from "./ITank";

export function HexBoard({ boardSize }: { boardSize: bigint | undefined }) {
  const [selectedTank, setSelectedTank] = useState<typeof ITank | undefined>();
  const [selectedTile, setSelectedTile] = useState<Hex | undefined>();
  const [highlightedTiles, setHighlightedTiles] = useState<Hex[] | undefined>();
  let tanks = useGameViewGetAllTanks({ watch: true });
  let hearts = useGameViewGetAllHearts({ watch: true });
  const { address } = useAccount();
  let ownerTankId = useTankGamePlayers({
    args: [address!],
    enabled: !!address,
  });
  let ownerTank = tanks.data?.find((tank) => tank.tankId === ownerTankId.data);
  let ownerTankTile = ownerTank
    ? new Hex(
        Number(ownerTank?.position.x!),
        Number(ownerTank?.position.y!),
        Number(ownerTank?.position.z!)
      )
    : undefined;
  const ref = useRef(null);
  const { width } = useContainerDimensions(ref);
  const a = hexagon(Number(boardSize!));
  return (
    <div className="border flex justify-center" ref={ref}>
      <TransformWrapper>
        <TransformComponent>
          <HexGrid
            width={width}
            height={width < 500 ? "50%" : undefined}
            viewBox="3 -25 150 150"
          >
            <Pattern id="owner" link="/logos/tank1.png" size={{ x: 1, y: 1 }} />
            <Pattern id="enemy" link="/logos/tank2.png" size={{ x: 1, y: 1 }} />
            <Pattern id="dead" link="/logos/tank3.png" size={{ x: 1, y: 1 }} />
            <Pattern id="heart" link="/logos/heart.png" size={{ x: 1, y: 1 }} />
            <Layout
              size={{
                x: 1,
                y: 1,
              }}
              flat={false}
              origin={{
                x: 0,
                y: 0,
              }}
            >
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
                const heartsOnTile = hearts.data?.find((heartLocation) => {
                  return (
                    heartLocation.position.x === BigInt(hex.q) &&
                    heartLocation.position.y === BigInt(hex.r) &&
                    heartLocation.position.z === BigInt(hex.s)
                  );
                });
                return (
                  <Tile
                    key={i}
                    x={Number(hex.q)}
                    y={Number(hex.r)}
                    z={Number(hex.s)}
                    distance={
                      ownerTankTile
                        ? getDistance(hex, ownerTankTile!)
                        : undefined
                    }
                    selected={
                      !!selectedTile &&
                      selectedTile!.q === hex.q &&
                      selectedTile!.r === hex.r &&
                      selectedTile!.s === hex.s
                    }
                    boardSize={a.length}
                    tank={tank}
                    heartsOnTile={heartsOnTile?.numHearts}
                    ownersTankId={ownerTankId.data!}
                    highlighted={
                      highlightedTiles?.some((tile) => {
                        return (
                          tile.q === hex.q &&
                          tile.r === hex.r &&
                          tile.s === hex.s
                        );
                      })!
                    }
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
                    onClick={(): void => {
                      setSelectedTank(tank);
                      setSelectedTile(hex);
                    }}
                    onContextClick={(): void => {
                      // if this tile is
                      setHighlightedTiles((prevTiles) => {
                        const tileExists = prevTiles?.some((tile) => {
                          return (
                            tile.q === hex.q &&
                            tile.r === hex.r &&
                            tile.s === hex.s
                          );
                        });
                        if (tileExists) {
                          return prevTiles?.filter((tile) => {
                            return (
                              tile.q !== hex.q ||
                              tile.r !== hex.r ||
                              tile.s !== hex.s
                            );
                          });
                        } else {
                          return [...(prevTiles || []), hex];
                        }
                      });
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
const useContainerDimensions = (myRef: MutableRefObject<null>) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  useEffect(() => {
    const getDimensions = () => ({
      // @ts-ignore
      width: myRef.current.offsetWidth,
      // @ts-ignore
      height: myRef.current.offsetHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};
