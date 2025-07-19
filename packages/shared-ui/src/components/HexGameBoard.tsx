import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GameId, GameState } from '@tact/game-logic';
import { useAllTanks, useAllHearts, useCurrentUser, useGameInfo, usePlayers } from '@tact/providers';
import { HexTileNode } from './HexTileNode.js';

// Dark mode styles for ReactFlow
const darkModeStyles = `
  .react-flow__controls {
    background: rgba(17, 24, 39, 0.9) !important;
    border: 1px solid #374151 !important;
  }
  
  .react-flow__controls-button {
    background: #374151 !important;
    border-color: #6b7280 !important;
    color: #f9fafb !important;
  }
  
  .react-flow__controls-button:hover {
    background: #4b5563 !important;
  }
  
  .react-flow__minimap {
    background: rgba(17, 24, 39, 0.9) !important;
    border: 1px solid #374151 !important;
  }
  
  .react-flow__attribution {
    background: rgba(17, 24, 39, 0.8) !important;
    color: #9ca3af !important;
  }
  
  .react-flow__attribution a {
    color: #60a5fa !important;
  }
`;

// Inject dark mode styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('reactflow-dark-mode');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'reactflow-dark-mode';
    style.textContent = darkModeStyles;
    document.head.appendChild(style);
  }
}

interface HexGameBoardProps {
  gameId: GameId;
  boardSize: number;
  className?: string;
}

// Custom node types
const nodeTypes = {
  hexTile: HexTileNode,
};

function HexGameBoardInner({ gameId, boardSize, className = '' }: HexGameBoardProps) {
  const [selectedTileId, setSelectedTileId] = useState<string | undefined>();
  const [highlightedTiles, setHighlightedTiles] = useState<string[]>([]);
  const [selectedTileData, setSelectedTileData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  
  const { data: tanksData, isLoading: tanksLoading } = useAllTanks(gameId, { watch: true });
  const { data: heartsData, isLoading: heartsLoading } = useAllHearts(gameId, { watch: true });
  const { data: currentUser } = useCurrentUser();
  const { data: gameInfo } = useGameInfo(gameId, { watch: true });
  const { data: players } = usePlayers(gameId, { watch: true });

  // Update current time every second for live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const tanks = tanksData || [];
  const hearts = heartsData || [];
  const ownerTank = tanks.find(tank => tank.owner === currentUser);

  // Calculate epoch information
  const getEpochInfo = () => {
    if (!gameInfo || gameInfo.state !== GameState.Started || !gameInfo.epochStart) {
      return { currentEpoch: 0, timeRemaining: 0, nextEpochTime: 0 };
    }

    const nowSeconds = Math.floor(currentTime / 1000);
    const epochStart = gameInfo.epochStart;
    const epochDuration = gameInfo.settings.epochSeconds;
    
    // Calculate how many epochs have passed since game start
    const epochsPassedSinceStart = Math.floor((nowSeconds - epochStart) / epochDuration);
    const currentGameEpoch = epochsPassedSinceStart;
    
    // Calculate time remaining in current epoch
    const currentEpochStartTime = epochStart + (epochsPassedSinceStart * epochDuration);
    const nextEpochTime = currentEpochStartTime + epochDuration;
    const timeRemaining = nextEpochTime - nowSeconds;
    
    return {
      currentEpoch: currentGameEpoch,
      timeRemaining: Math.max(0, timeRemaining),
      nextEpochTime
    };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const epochInfo = getEpochInfo();

  // Debug logging
  console.log('HexGameBoard Debug:', { 
    tanksCount: tanks.length, 
    heartsCount: hearts.length, 
    currentUser,
    tanks: tanks.map(t => ({ id: t.tankId, owner: t.owner, position: t.position }))
  });

  const handleTileClick = useCallback((nodeId: string, q: number, r: number, s: number, tank: any, heartsOnTile: number, distance?: number) => {
    setSelectedTileId(nodeId);
    setSelectedTileData({
      nodeId,
      q, r, s,
      tank,
      heartsOnTile,
      distance,
      ownerTank
    });
    console.log(`Clicked tile at (${q}, ${r}, ${s})`, tank);
    console.log('selectedTileData:', { nodeId, q, r, s, tank, heartsOnTile, distance, ownerTank });
  }, [ownerTank]);

  const handleTileContextClick = useCallback((nodeId: string) => {
    // Toggle highlighting like the old behavior
    setHighlightedTiles(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      } else {
        return [...prev, nodeId];
      }
    });
    
    // Right-click behavior - just toggle highlighting for now
  }, []);

  // Generate hex grid nodes
  const hexNodes = useMemo(() => {
    const nodes: Node[] = [];
    const radius = Math.floor(boardSize / 2);
    const hexSize = 30; // Size of each hex tile (radius)
    const hexWidth = hexSize * Math.sqrt(3); // Distance between hex centers horizontally
    const hexHeight = hexSize * 3/2; // Distance between hex centers vertically
    
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      
      for (let r = r1; r <= r2; r++) {
        const s = -q - r;
        const nodeId = `hex-${q}-${r}-${s}`;
        
        // Convert hex coordinates to pixel coordinates for flat-topped hexagons
        const x = hexWidth * (q + 0.5 * r);
        const y = hexHeight * r;
        
        // Find tank at this position (game uses 3D hex coordinates x,y,z mapped to q,r,s)
        const tank = tanks.find(tank => 
          tank.position.x === q && tank.position.y === r && tank.position.z === s
        );

        // Debug log for tanks found at any position
        if (tank) {
          console.log('Tank found at position:', { q, r, s, tank: { id: tank.tankId, owner: tank.owner, hearts: tank.hearts } });
          console.log('Passing tank data to node:', { nodeId, hasTank: !!tank, tankData: tank });
        }
        
        // Find hearts at this position
        const heartsOnTile = hearts.find(heart => 
          heart.position.x === q && heart.position.y === r && heart.position.z === s
        );
        
        // Calculate distance from owner tank
        const distance = ownerTank ? getHexDistance(
          { q, r, s },
          { q: ownerTank.position.x, r: ownerTank.position.y, s: ownerTank.position.z }
        ) : undefined;
        
        // Determine tile state
        const selected = selectedTileId === nodeId;
        const highlighted = highlightedTiles.includes(nodeId);
        const isShootRange = ownerTank && distance !== undefined && distance <= ownerTank.range && distance > 0;
        const isMoveRange = ownerTank && distance === 1;
        
        nodes.push({
          id: nodeId,
          type: 'hexTile',
          position: { x, y },
          width: hexSize * 2,
          height: hexSize * 2,
          data: {
            gameId,
            q,
            r,
            s,
            tank,
            heartsOnTile: heartsOnTile ? 1 : 0,
            ownerTank,
            distance,
            selected,
            highlighted,
            isShootRange,
            isMoveRange,
            onTileClick: () => handleTileClick(nodeId, q, r, s, tank, heartsOnTile ? 1 : 0, distance),
            onTileContextClick: () => handleTileContextClick(nodeId),
          },
          draggable: false,
          selectable: true,
        });
      }
    }
    
    return nodes;
  }, [tanks, hearts, ownerTank, selectedTileId, highlightedTiles, boardSize, gameId, handleTileClick, handleTileContextClick]);

  // Force fitView after nodes are loaded to ensure proper centering
  useEffect(() => {
    if (hexNodes.length > 0 && !tanksLoading && !heartsLoading) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.1, includeHiddenNodes: false });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hexNodes.length, tanksLoading, heartsLoading, fitView]);

  const [edges] = useEdgesState([]);

  const onNodeChange = useCallback(() => {
    // Prevent node changes to maintain grid layout
  }, []);

  const onEdgeChange = useCallback(() => {
    // No edges in hex grid
  }, []);

  const onConnect = useCallback(() => {
    // No connections in hex grid
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    event.stopPropagation();
    const data = node.data;
    if (data && data.onTileClick) {
      data.onTileClick();
    }
  }, []);

  if (tanksLoading || heartsLoading) {
    return (
      <div className={`flex justify-center items-center h-screen w-screen ${className}`}>
        <div>Loading game board...</div>
      </div>
    );
  }

  return (
    <div ref={reactFlowWrapper} className={`${className}`} style={{ height: 'calc(100vh - 40px)', width: '100vw', marginTop: '40px' }}>
      <ReactFlow
        nodes={hexNodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
        }}
        minZoom={0.2}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={[1, 2]}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        selectNodesOnDrag={false}
      >
        <Background 
          color="#4b5563" 
          gap={16} 
          style={{ backgroundColor: '#111827' }}
        />
        <Controls />
        <MiniMap 
          nodeColor={(node: any) => {
            const tank = node.data?.tank;
            const ownerTank = node.data?.ownerTank;
            
            if (tank) {
              if (tank.hearts === 0) return '#6b7280'; // dead - gray
              if (tank === ownerTank || tank.owner === ownerTank?.owner) return '#3b82f6'; // owner - blue  
              return '#ef4444'; // enemy - red
            }
            if (node.data?.heartsOnTile > 0) return '#10b981'; // heart - green
            return '#4b5563'; // empty - dark gray
          }}
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid #374151',
          }}
          maskColor="rgba(17, 24, 39, 0.8)"
        />
        
        {/* Game Info Panel - Top Left */}
        <Panel position="top-left" className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 m-4 min-w-64">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Game Status</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div><strong className="text-white">State:</strong> {gameInfo?.state === 0 ? 'Waiting' : gameInfo?.state === 1 ? 'Started' : 'Ended'}</div>
              <div><strong className="text-white">Players:</strong> {players?.length || 0} / {gameInfo?.settings?.maxPlayers || 0}</div>
              <div><strong className="text-white">Board Size:</strong> {gameInfo?.settings?.boardSize || boardSize}</div>
              
              {/* Start Game Button - only show if waiting and have enough players */}
              {gameInfo?.state === 0 && (players?.length || 0) >= 2 && gameInfo?.owner === currentUser && (
                <div className="border-t border-gray-600 pt-2 mt-3">
                  <button 
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors text-sm font-medium"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/games/${gameId}/start`, { method: 'POST' });
                        if (!response.ok) throw new Error('Failed to start game');
                        // Game will refresh via polling
                      } catch (err) {
                        console.error('Failed to start game:', err);
                      }
                    }}
                  >
                    Start Game
                  </button>
                </div>
              )}
              
              {/* Epoch Clock */}
              {gameInfo?.state === GameState.Started && (
                <div className="border-t border-gray-600 pt-2 mt-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">Epoch:</strong>
                    <span className="text-blue-400 font-mono">{epochInfo.currentEpoch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <strong className="text-white">Next Drip:</strong>
                    <span className="text-green-400 font-mono">
                      {epochInfo.timeRemaining > 0 ? formatTime(epochInfo.timeRemaining) : 'Now!'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${((gameInfo.settings.epochSeconds - epochInfo.timeRemaining) / gameInfo.settings.epochSeconds) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {gameInfo?.epochStart && gameInfo?.state === GameState.Started && (
                <div><strong className="text-white">Started:</strong> {new Date(gameInfo.epochStart * 1000).toLocaleTimeString()}</div>
              )}
            </div>
          </div>
        </Panel>

        {/* Player Tank Info Panel - Top Right */}
        {ownerTank && (
          <Panel position="top-right" className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 m-4 min-w-64">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400">🚗 Your Tank</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div><strong className="text-white">Position:</strong> ({ownerTank.position.x}, {ownerTank.position.y}, {ownerTank.position.z})</div>
                <div><strong className="text-white">Hearts:</strong> <span className="text-red-400">♥️ {ownerTank.hearts}</span></div>
                <div><strong className="text-white">Action Points:</strong> <span className="text-blue-400">⚡ {ownerTank.aps}</span></div>
                <div><strong className="text-white">Range:</strong> <span className="text-purple-400">🎯 {ownerTank.range}</span></div>
                {ownerTank.hearts === 0 && (
                  <div className="text-red-400 font-medium">💀 Tank Destroyed</div>
                )}
              </div>
            </div>
          </Panel>
        )}

        {/* Selected Tile Panel - Below Tank Panel */}
        {selectedTileData && (
          <Panel position="top-right" className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 m-4 min-w-64 max-w-80" style={{ top: ownerTank ? '180px' : '20px' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Tile Information</h3>
                <button
                  onClick={() => {
                    setSelectedTileId(undefined);
                    setSelectedTileData(null);
                  }}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <strong className="text-white">Position:</strong> ({selectedTileData.q}, {selectedTileData.r}, {selectedTileData.s})
                </div>
                
                {selectedTileData.distance !== undefined && (
                  <div>
                    <strong className="text-white">Distance:</strong> {selectedTileData.distance}
                  </div>
                )}

                {selectedTileData.tank ? (
                  <div className="space-y-2">
                    <div className="text-base font-medium text-white">
                      {selectedTileData.tank === selectedTileData.ownerTank || 
                       selectedTileData.tank.owner === selectedTileData.ownerTank?.owner ? '🚗 Your Tank' : '🚗 Enemy Tank'}
                    </div>
                    <div><strong className="text-white">Player:</strong> {selectedTileData.tank.playerName || 'Unknown'}</div>
                    <div><strong className="text-white">Tank Position:</strong> ({selectedTileData.tank.position.x}, {selectedTileData.tank.position.y}, {selectedTileData.tank.position.z})</div>
                    <div><strong className="text-white">Hearts:</strong> <span className="text-red-400">{selectedTileData.tank.hearts}</span></div>
                    <div><strong className="text-white">APs:</strong> <span className="text-blue-400">{selectedTileData.tank.aps}</span></div>
                    <div><strong className="text-white">Range:</strong> <span className="text-purple-400">{selectedTileData.tank.range}</span></div>
                    {selectedTileData.tank.hearts === 0 && (
                      <div className="text-red-400 font-medium">💀 Tank Destroyed</div>
                    )}
                  </div>
                ) : selectedTileData.heartsOnTile > 0 ? (
                  <div className="space-y-2">
                    <div className="text-base font-medium text-green-400">♥️ Heart Power-up</div>
                    <div className="text-gray-300">Collect to gain health!</div>
                  </div>
                ) : (
                  <div className="text-gray-400">Empty tile</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-600">
                {!selectedTileData.tank && selectedTileData.distance === 1 && selectedTileData.ownerTank && (
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-sm">
                    Move Here (1 AP)
                  </button>
                )}
                
                {selectedTileData.tank && selectedTileData.tank === selectedTileData.ownerTank && (
                  <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors text-sm">
                    Upgrade Tank
                  </button>
                )}
                
                {selectedTileData.tank && selectedTileData.tank !== selectedTileData.ownerTank && selectedTileData.tank.hearts > 0 && (
                  <div className="space-y-1">
                    <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors text-sm">
                      Shoot Tank
                    </button>
                    <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors text-sm">
                      Give Resources
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        )}

        {/* Players List Panel - Bottom Left */}
        {players && players.length > 0 && (
          <Panel position="bottom-left" className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-4 m-4 min-w-64 max-w-80">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Players ({players.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => {
                  const playerTank = tanks.find(t => t.owner === player.address);
                  return (
                    <div key={player.address} className="flex justify-between items-center text-sm p-2 bg-gray-800/60 rounded border border-gray-600">
                      <div className="flex-1">
                        <div className="font-medium text-white">{player.name}</div>
                        <div className="text-gray-400 text-xs">{player.address.slice(0, 8)}...</div>
                      </div>
                      {playerTank && (
                        <div className="flex space-x-2 text-xs">
                          <span className="text-red-400">♥️{playerTank.hearts}</span>
                          <span className="text-blue-400">⚡{playerTank.aps}</span>
                          <span className="text-purple-400">🎯{playerTank.range}</span>
                          {playerTank.hearts === 0 && <span>💀</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        )}
        
      </ReactFlow>
    </div>
  );
}

// Helper function to calculate hex distance
function getHexDistance(
  a: { q: number; r: number; s: number },
  b: { q: number; r: number; s: number }
): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

export function HexGameBoard(props: HexGameBoardProps) {
  return (
    <ReactFlowProvider>
      <HexGameBoardInner {...props} />
    </ReactFlowProvider>
  );
}