import { Handle, Position } from '@xyflow/react';
import { GameId } from '@tact/game-logic';

interface HexTileData {
  gameId: GameId;
  q: number;
  r: number;
  s: number;
  tank?: any;
  heartsOnTile: number;
  ownerTank?: any;
  distance?: number;
  selected: boolean;
  highlighted: boolean;
  isShootRange: boolean;
  isMoveRange: boolean;
  onTileClick: () => void;
  onTileContextClick: () => void;
}

export function HexTileNode({ data }: { data: HexTileData }) {
  // Debug log when tank is present
  if (data.tank) {
    console.log('HexTileNode rendering tank:', { 
      position: `(${data.q}, ${data.r}, ${data.s})`, 
      tank: { id: data.tank.tankId, hearts: data.tank.hearts },
      color: data.tank.hearts === 0 ? 'gray' : (data.tank === data.ownerTank ? 'blue' : 'red')
    });
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    data.onTileClick();
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    data.onTileContextClick();
  };

  // Determine hex colors
  const getHexColor = () => {
    if (data.selected) return '#bbf7d0'; // green-200
    if (data.highlighted) return '#fed7aa'; // orange-200  
    if (data.isShootRange && data.isMoveRange) return '#fed7aa'; // orange-200
    if (data.isShootRange) return '#fecaca'; // red-200
    if (data.isMoveRange) return '#bfdbfe'; // blue-200
    return '#f3f4f6'; // gray-100
  };


  const getTankColor = () => {
    if (data.tank) {
      if (data.tank.hearts === 0) return '#6b7280'; // dead - gray
      if (data.tank === data.ownerTank || data.tank.owner === data.ownerTank?.owner) {
        return '#3b82f6'; // owner - blue
      }
      return '#ef4444'; // enemy - red
    }
    if (data.heartsOnTile > 0) return '#10b981'; // heart - green
    return 'transparent';
  };

  const hexSize = 30;
  const hexPoints = [
    [0, -hexSize],
    [hexSize * Math.sqrt(3)/2, -hexSize/2],
    [hexSize * Math.sqrt(3)/2, hexSize/2],
    [0, hexSize],
    [-hexSize * Math.sqrt(3)/2, hexSize/2],
    [-hexSize * Math.sqrt(3)/2, -hexSize/2]
  ].map(([x, y]) => `${x + hexSize},${y + hexSize}`).join(' ');

  return (
    <>
      <svg
        width={hexSize * 2}
        height={hexSize * 2}
        style={{ 
          cursor: 'pointer', 
          overflow: 'visible',
          pointerEvents: 'all'
        }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleContextMenu}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <polygon
          points={hexPoints}
          fill={getHexColor()}
          stroke={data.selected ? '#10b981' : '#6b7280'}
          strokeWidth={data.selected ? 3 : 2}
        />
        
        {/* Tank indicator */}
        {data.tank && (
          <circle
            cx={hexSize}
            cy={hexSize}
            r="15"
            fill={getTankColor()}
            stroke="white"
            strokeWidth="2"
          />
        )}
        
        {/* Tank emoji */}
        {data.tank && (
          <text
            x={hexSize}
            y={hexSize + 3}
            textAnchor="middle"
            fontSize="14"
            fill="white"
          >
            {data.tank.hearts === 0 ? '💀' : '🚗'}
          </text>
        )}

        {/* Heart indicator */}
        {!data.tank && data.heartsOnTile > 0 && (
          <>
            <circle
              cx={hexSize}
              cy={hexSize}
              r="12"
              fill={getTankColor()}
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={hexSize}
              y={hexSize + 3}
              textAnchor="middle"
              fontSize="12"
              fill="white"
            >
              ♥️
            </text>
          </>
        )}

      </svg>

      {/* Hidden handles (React Flow requirement) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: 'hidden' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ visibility: 'hidden' }}
      />
    </>
  );
}