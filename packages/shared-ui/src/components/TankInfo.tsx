import { Hex } from 'react-hexgrid';
import { Heart, Zap, Target, User } from 'lucide-react';
import { Tank } from '@tact/game-logic';

interface TankInfoProps {
  tank: Tank;
  hex: Hex;
  isOwner: boolean;
  show: boolean;
}

export function TankInfo({ tank, hex, isOwner, show }: TankInfoProps) {
  if (!show) return null;

  return (
    <g>
      {/* Tank stats overlay */}
      <foreignObject
        x={hex.q * 20 - 20}
        y={hex.r * 20 - 30}
        width={40}
        height={60}
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-black bg-opacity-75 text-white text-xs p-1 rounded flex flex-col items-center">
          {/* Player name */}
          <div className="flex items-center mb-1">
            <User size={10} className="mr-1" />
            <span className="truncate max-w-20">
              {tank.playerName || `Tank ${tank.tankId}`}
            </span>
          </div>
          
          {/* Hearts */}
          <div className="flex items-center mb-1">
            <Heart size={10} className="mr-1 text-red-500" />
            <span>{tank.hearts}</span>
          </div>
          
          {/* Action Points */}
          <div className="flex items-center mb-1">
            <Zap size={10} className="mr-1 text-yellow-500" />
            <span>{tank.aps}</span>
          </div>
          
          {/* Range */}
          <div className="flex items-center">
            <Target size={10} className="mr-1 text-blue-500" />
            <span>{tank.range}</span>
          </div>
        </div>
      </foreignObject>
      
      {/* Owner indicator */}
      {isOwner && (
        <circle
          cx={hex.q * 20}
          cy={hex.r * 20 + 15}
          r={3}
          fill="gold"
          stroke="orange"
          strokeWidth={1}
        />
      )}
      
      {/* Dead indicator */}
      {tank.hearts <= 0 && (
        <text
          x={hex.q * 20}
          y={hex.r * 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="red"
          fontWeight="bold"
        >
          💀
        </text>
      )}
    </g>
  );
}