declare module 'react-hexgrid' {
  import { ReactNode, MouseEvent } from 'react';

  export class Hex {
    q: number;
    r: number;
    s: number;
    
    constructor(q: number, r: number, s: number);
  }

  export interface HexagonProps {
    q: number;
    r: number;
    s: number;
    onClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onContextMenu?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    onDoubleClick?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    fill?: string;
  }

  export const Hexagon: React.FC<HexagonProps>;
}