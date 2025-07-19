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
import { GameId, GameState, GameRules } from '@tact/game-logic';
import { useAllTanks, useAllHearts, useCurrentUser, useGameInfo, usePlayers, useMovePlayer, useShootPlayer, useUpgradePlayer, useGiveToPlayer, useClaimableAPs } from '@tact/providers';
import { HexTileNode } from './HexTileNode.js';
import { ActivityLog } from './ActivityLog.js';

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
  onToast?: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
}

// Custom node types
const nodeTypes = {
  hexTile: HexTileNode,
};

function HexGameBoardInner({ gameId, boardSize, className = '', onToast }: HexGameBoardProps) {
  const [selectedTileId, setSelectedTileId] = useState<string | undefined>();
  const [selectedTileData, setSelectedTileData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);
  const [newEpochSeconds, setNewEpochSeconds] = useState<number>(0);
  const [settingsLoading, setSettingsLoading] = useState(false);
  
  // Panel minimize states - auto-minimize on narrow screens
  const [gameStatusMinimized, setGameStatusMinimized] = useState(false);
  const [tankInfoMinimized, setTankInfoMinimized] = useState(false);
  const [selectedTileMinimized, setSelectedTileMinimized] = useState(false);
  
  // Auto-minimize panels on narrow screens
  useEffect(() => {
    const checkScreenSize = () => {
      const isNarrow = window.innerWidth < 1024; // lg breakpoint
      if (isNarrow) {
        setGameStatusMinimized(true);
        setTankInfoMinimized(true);
        setSelectedTileMinimized(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const [showPlayers, setShowPlayers] = useState(true);
  const [claimApLoading, setClaimApLoading] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  
  const { data: tanksData, isLoading: tanksLoading, refetch: refetchTanks } = useAllTanks(gameId, { watch: true });
  const { data: heartsData, isLoading: heartsLoading } = useAllHearts(gameId, { watch: true });
  const { data: currentUser } = useCurrentUser();
  const { data: gameInfo, refetch: refetchGameInfo } = useGameInfo(gameId, { watch: true });
  const { data: players, refetch: refetchPlayers } = usePlayers(gameId, { watch: true });

  // Action hooks
  const { movePlayer, isLoading: moveLoading } = useMovePlayer();
  const { shootPlayer, isLoading: shootLoading } = useShootPlayer();
  const { upgradePlayer, isLoading: upgradeLoading } = useUpgradePlayer();
  const { giveToPlayer, isLoading: giveLoading } = useGiveToPlayer();

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

  // Calculate available APs based on epoch system
  const getAvailableAPs = useCallback(() => {
    if (!gameInfo || !ownerTank || gameInfo.state !== GameState.Started) {
      return ownerTank?.aps || 0; // Return current APs if game not started
    }

    const currentStoredAps = ownerTank.aps;
    
    // The tank's stored APs represent how many they have left to use
    // We don't need to subtract "used" APs because the database already tracks remaining APs
    return Math.max(0, currentStoredAps);
  }, [gameInfo, ownerTank, epochInfo.currentEpoch]);

  // Fetch claimable APs from backend
  const { data: claimableData, refetch: refetchClaimableAPs } = useClaimableAPs(
    gameId, 
    currentUser || '', 
    { watch: true }
  );
  const claimableAPs = claimableData?.claimableAPs || 0;
  const claimReason = claimableData?.reason;

  const availableAPs = getAvailableAPs();
  const moveRange = availableAPs; // Use full available APs for movement range

  // Debug logging
  console.log('HexGameBoard Debug:', { 
    tanksCount: tanks.length, 
    heartsCount: hearts.length, 
    currentUser,
    availableAPs,
    moveRange,
    claimableAPs,
    claimReason,
    currentEpoch: epochInfo.currentEpoch,
    epochMaxAPs: gameInfo?.settings?.epochMaxActionPoints,
    ownerTankAPs: ownerTank?.aps,
    tanks: tanks.map(t => ({ id: t.tankId, owner: t.owner, position: t.position, aps: t.aps }))
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

  // Action handlers
  const handleMove = useCallback(async (targetQ: number, targetR: number, targetS: number) => {
    if (!currentUser || !ownerTank) return;
    
    const result = await movePlayer(gameId, currentUser, { x: targetQ, y: targetR, z: targetS });
    if (result.success) {
      onToast?.({ 
        type: 'success', 
        title: 'Moved!', 
        description: `Moved to (${targetQ}, ${targetR}, ${targetS})` 
      });
      // Immediately refetch game state
      refetchTanks();
      refetchGameInfo();
      setSelectedTileId(undefined);
      setSelectedTileData(null);
    } else {
      onToast?.({ 
        type: 'error', 
        title: 'Move failed', 
        description: result.error || 'Unknown error' 
      });
    }
  }, [currentUser, ownerTank, movePlayer, gameId, onToast, refetchTanks, refetchGameInfo]);

  const handleShoot = useCallback(async (targetTank: any) => {
    if (!currentUser || !targetTank) return;
    
    const result = await shootPlayer(gameId, currentUser, targetTank.owner);
    if (result.success) {
      onToast?.({ 
        type: 'success', 
        title: 'Shot fired!', 
        description: `Attacked ${targetTank.playerName || 'enemy tank'}` 
      });
      // Immediately refetch game state
      refetchTanks();
      refetchPlayers();
      refetchGameInfo();
      setSelectedTileId(undefined);
      setSelectedTileData(null);
    } else {
      onToast?.({ 
        type: 'error', 
        title: 'Attack failed', 
        description: result.error || 'Unknown error' 
      });
    }
  }, [currentUser, shootPlayer, gameId, onToast, refetchTanks, refetchPlayers, refetchGameInfo]);

  const handleUpgrade = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await upgradePlayer(gameId, currentUser);
    if (result.success) {
      onToast?.({ 
        type: 'success', 
        title: 'Tank upgraded!', 
        description: 'Range increased by 1' 
      });
      // Immediately refetch game state
      refetchTanks();
      refetchGameInfo();
      setSelectedTileId(undefined);
      setSelectedTileData(null);
    } else {
      onToast?.({ 
        type: 'error', 
        title: 'Upgrade failed', 
        description: result.error || 'Unknown error' 
      });
    }
  }, [currentUser, upgradePlayer, gameId, onToast, refetchTanks, refetchGameInfo]);

  const handleGive = useCallback(async (targetTank: any) => {
    if (!currentUser || !targetTank) return;
    
    // For now, give 1 heart - could be made configurable
    const result = await giveToPlayer(gameId, currentUser, targetTank.owner, 1, 0);
    if (result.success) {
      onToast?.({ 
        type: 'success', 
        title: 'Resources given!', 
        description: `Gave 1 heart to ${targetTank.playerName || 'player'}` 
      });
      // Immediately refetch game state
      refetchTanks();
      refetchGameInfo();
      setSelectedTileId(undefined);
      setSelectedTileData(null);
    } else {
      onToast?.({ 
        type: 'error', 
        title: 'Gift failed', 
        description: result.error || 'Unknown error' 
      });
    }
  }, [currentUser, giveToPlayer, gameId, onToast, refetchTanks, refetchGameInfo]);

  // Settings handler
  const handleUpdateSettings = useCallback(async () => {
    if (!currentUser || !gameInfo || newEpochSeconds <= 0) return;
    
    setSettingsLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updaterId: currentUser, epochSeconds: newEpochSeconds }),
      });

      if (response.ok) {
        onToast?.({ 
          type: 'success', 
          title: 'Settings updated!', 
          description: `Epoch length changed to ${newEpochSeconds} seconds` 
        });
        refetchGameInfo();
        setShowSettings(false);
        setNewEpochSeconds(0);
      } else {
        const error = await response.json();
        onToast?.({ 
          type: 'error', 
          title: 'Settings update failed', 
          description: error.error || 'Unknown error' 
        });
      }
    } catch (err) {
      onToast?.({ 
        type: 'error', 
        title: 'Settings update failed', 
        description: err instanceof Error ? err.message : 'Network error' 
      });
    } finally {
      setSettingsLoading(false);
    }
  }, [currentUser, gameInfo, newEpochSeconds, gameId, onToast, refetchGameInfo]);

  // Claim AP handler
  const handleClaimAPs = useCallback(async () => {
    if (!currentUser) return;
    
    setClaimApLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/claim-aps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: currentUser }),
      });

      if (response.ok) {
        const data = await response.json();
        onToast?.({ 
          type: 'success', 
          title: 'APs Claimed!', 
          description: `Claimed ${data.apsClaimed} AP${data.apsClaimed !== 1 ? 's' : ''} (Total: ${data.newTotal})` 
        });
        refetchTanks();
        refetchGameInfo();
        refetchClaimableAPs();
      } else {
        const error = await response.json();
        onToast?.({ 
          type: 'error', 
          title: 'Claim failed', 
          description: error.error || 'Unknown error' 
        });
      }
    } catch (err) {
      onToast?.({ 
        type: 'error', 
        title: 'Claim failed', 
        description: err instanceof Error ? err.message : 'Network error' 
      });
    } finally {
      setClaimApLoading(false);
    }
  }, [currentUser, gameId, onToast, refetchTanks, refetchGameInfo, refetchClaimableAPs]);

  // Initialize epoch seconds when settings panel opens
  useEffect(() => {
    if (showSettings && gameInfo) {
      setNewEpochSeconds(gameInfo.settings.epochSeconds);
    }
  }, [showSettings, gameInfo]);

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
        const isShootRange = ownerTank && distance !== undefined && distance <= ownerTank.range && distance > 0;
        const isMoveRange = ownerTank && distance !== undefined && distance <= moveRange && distance > 0;
        
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
            highlighted: false,
            isShootRange,
            isMoveRange,
            onTileClick: () => handleTileClick(nodeId, q, r, s, tank, heartsOnTile ? 1 : 0, distance),
            onTileContextClick: () => handleTileClick(nodeId, q, r, s, tank, heartsOnTile ? 1 : 0, distance),
          },
          draggable: false,
          selectable: true,
        });
      }
    }
    
    return nodes;
  }, [tanks, hearts, ownerTank, selectedTileId, boardSize, gameId, handleTileClick, moveRange]);

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

  // Remove loading state - let component mount immediately and load data in background

  return (
    <div ref={reactFlowWrapper} className={`${className}`} style={{ 
      height: 'calc(100vh - 40px)', 
      width: '100vw', 
      marginTop: '40px',
      willChange: 'transform',
      transform: 'translateZ(0)' // Force GPU acceleration
    }}>
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
        proOptions={{ hideAttribution: true }}
        disableKeyboardA11y={true}
        panOnDrag={[1, 2]}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
      >
        {/* Activity Log */}
        <ActivityLog 
          gameId={gameId} 
          currentUser={currentUser || undefined}
          gameState={gameInfo?.state}
        />
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
        <Panel position="top-left" className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl m-4 ${gameStatusMinimized ? 'p-2' : 'p-4 min-w-64'}`}>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Game Status</h3>
              <button
                onClick={() => setGameStatusMinimized(!gameStatusMinimized)}
                className="text-gray-400 hover:text-gray-200 transition-colors text-sm ml-2"
                title={gameStatusMinimized ? 'Expand Panel' : 'Minimize Panel'}
              >
                {gameStatusMinimized ? '📋' : '−'}
              </button>
            </div>
            {!gameStatusMinimized && (
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

              {/* Settings Button - only show for game owner */}
              {gameInfo?.owner === currentUser && (
                <div className="border-t border-gray-600 pt-2 mt-3">
                  <button 
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors text-sm font-medium"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    {showSettings ? 'Hide Settings' : 'Game Settings'}
                  </button>
                  
                  {/* Settings Panel */}
                  {showSettings && (
                    <div className="mt-3 space-y-3 p-3 bg-gray-800/60 rounded border border-gray-600">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Epoch Length (seconds)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={newEpochSeconds}
                            onChange={(e) => setNewEpochSeconds(parseInt(e.target.value) || 0)}
                            min="60"
                            max="86400"
                            className="flex-1 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                          />
                          <button
                            onClick={handleUpdateSettings}
                            disabled={settingsLoading || newEpochSeconds <= 0 || newEpochSeconds === gameInfo?.settings?.epochSeconds}
                            className="px-2 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded text-xs"
                          >
                            {settingsLoading ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Current: {gameInfo?.settings?.epochSeconds}s ({Math.round((gameInfo?.settings?.epochSeconds || 0) / 60)}min)
                        </div>
                      </div>
                    </div>
                  )}
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
              
              {/* Collapsible Players List */}
              {players && players.length > 0 && (
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <button 
                    onClick={() => setShowPlayers(!showPlayers)}
                    className="flex items-center justify-between w-full text-sm font-semibold text-white mb-2 hover:text-gray-300 transition-colors"
                  >
                    <span>Players ({players.length})</span>
                    <span className={`transform transition-transform ${showPlayers ? 'rotate-90' : ''}`}>▶</span>
                  </button>
                  {showPlayers && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {players.map((player) => {
                        const playerTank = tanks.find(t => t.owner === player.address);
                        return (
                          <div key={player.address} className="flex justify-between items-center text-xs p-2 bg-gray-800/60 rounded border border-gray-600">
                            <div className="flex-1">
                              <div className="font-medium text-white">{player.name}</div>
                            </div>
                            {playerTank && (
                              <div className="flex space-x-1 text-xs">
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
                  )}
                </div>
              )}
              </div>
            )}
          </div>
        </Panel>

        {/* Tank Info Panel - Top Right - only show if no tile selected OR selected tile is your own tank */}
        {ownerTank && (!selectedTileData || (selectedTileData.tank && selectedTileData.tank === selectedTileData.ownerTank)) && (
          <Panel position="top-right" className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl m-4 ${tankInfoMinimized ? 'p-2' : 'p-4 min-w-64'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-400">🚗 Your Tank</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTankInfoMinimized(!tankInfoMinimized)}
                    className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
                    title={tankInfoMinimized ? 'Expand Panel' : 'Minimize Panel'}
                  >
                    {tankInfoMinimized ? '🚗' : '−'}
                  </button>
                  {selectedTileData && (
                    <button
                      onClick={() => {
                        setSelectedTileId(undefined);
                        setSelectedTileData(null);
                      }}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {!tankInfoMinimized && (
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong className="text-white">Position:</strong> ({ownerTank.position.x}, {ownerTank.position.y}, {ownerTank.position.z})</div>
                  <div><strong className="text-white">Hearts:</strong> <span className="text-red-400">♥️ {ownerTank.hearts}</span></div>
                  <div><strong className="text-white">Action Points:</strong> <span className="text-blue-400">⚡ {ownerTank.aps}</span></div>
                  <div><strong className="text-white">Move Range:</strong> <span className="text-green-400">🦶 {moveRange}</span></div>
                  <div><strong className="text-white">Shoot Range:</strong> <span className="text-purple-400">🎯 {ownerTank.range}</span></div>
                  {ownerTank.hearts === 0 && (
                    <div className="text-red-400 font-medium">💀 Tank Destroyed</div>
                  )}

                  {/* Tank Actions - only show when viewing your own tank */}
                  {selectedTileData && selectedTileData.tank === selectedTileData.ownerTank && ownerTank.hearts > 0 && (
                    <div className="border-t border-gray-600 pt-2 space-y-2">
                      <h4 className="text-sm font-semibold text-white">Tank Actions</h4>
                      
                      {/* Claim APs Button */}
                      {gameInfo?.state === GameState.Started && (
                        <button 
                          className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                          onClick={handleClaimAPs}
                          disabled={claimApLoading || claimableAPs <= 0}
                          title={claimableAPs <= 0 ? claimReason : `Claim ${claimableAPs} AP${claimableAPs !== 1 ? 's' : ''}`}
                        >
                          {claimApLoading 
                            ? 'Claiming...' 
                            : claimableAPs > 0 
                              ? `Claim ${claimableAPs} AP${claimableAPs !== 1 ? 's' : ''}` 
                              : 'Claim APs'
                          }
                        </button>
                      )}
                      
                      {/* Upgrade Button */}
                      {(() => {
                        const upgradeCost = GameRules.getUpgradeCost(ownerTank.range);
                        const canAfford = ownerTank.aps >= upgradeCost;
                        const disabledReason = !canAfford ? `Need ${upgradeCost} AP to upgrade` : '';
                        
                        return (
                          <button 
                            className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                            onClick={handleUpgrade}
                            disabled={upgradeLoading || !canAfford}
                            title={disabledReason}
                          >
                            {upgradeLoading ? 'Upgrading...' : `Upgrade Tank (${upgradeCost} AP)`}
                          </button>
                        );
                      })()}
                    </div>
                  )}

                  {/* General Tank Info - show claim button even when not selected */}
                  {!selectedTileData && gameInfo?.state === GameState.Started && ownerTank.hearts > 0 && (
                    <div className="border-t border-gray-600 pt-2">
                      <button 
                        className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                        onClick={handleClaimAPs}
                        disabled={claimApLoading || claimableAPs <= 0}
                        title={claimableAPs <= 0 ? claimReason : `Claim ${claimableAPs} AP${claimableAPs !== 1 ? 's' : ''}`}
                      >
                        {claimApLoading 
                          ? 'Claiming...' 
                          : claimableAPs > 0 
                            ? `Claim ${claimableAPs} AP${claimableAPs !== 1 ? 's' : ''}` 
                            : 'Claim APs'
                        }
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>
        )}

        {/* Selected Tile Panel - Only show for non-tank tiles or enemy tanks */}
        {selectedTileData && (!selectedTileData.tank || selectedTileData.tank !== selectedTileData.ownerTank) && (
          <Panel position="top-right" className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl m-4 ${selectedTileMinimized ? 'p-2' : 'p-4 min-w-64 max-w-80'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Tile Information</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTileMinimized(!selectedTileMinimized)}
                    className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
                    title={selectedTileMinimized ? 'Expand Panel' : 'Minimize Panel'}
                  >
                    {selectedTileMinimized ? '🎯' : '−'}
                  </button>
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
              </div>
              {!selectedTileMinimized && (
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

                  {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-gray-600">
                      {!selectedTileData.tank && selectedTileData.distance !== undefined && selectedTileData.distance <= moveRange && selectedTileData.distance > 0 && selectedTileData.ownerTank && selectedTileData.ownerTank.hearts > 0 && (() => {
                        const moveCost = selectedTileData.distance; // Cost is equal to distance
                        const canMove = selectedTileData.ownerTank.aps >= moveCost;
                        const disabledReason = !canMove ? `Need ${moveCost} AP${moveCost > 1 ? 's' : ''} to move` : '';
                        
                        return (
                          <button 
                            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                            onClick={() => handleMove(selectedTileData.q, selectedTileData.r, selectedTileData.s)}
                            disabled={moveLoading || !canMove}
                            title={disabledReason}
                          >
                            {moveLoading ? 'Moving...' : `Move Here (${moveCost} AP${moveCost > 1 ? 's' : ''})`}
                          </button>
                        );
                      })()}
                      
                      {selectedTileData.tank && selectedTileData.tank !== selectedTileData.ownerTank && selectedTileData.tank.hearts > 0 && selectedTileData.ownerTank?.hearts > 0 && (() => {
                        const inShootRange = selectedTileData.distance !== undefined && 
                                            selectedTileData.distance <= selectedTileData.ownerTank.range && 
                                            selectedTileData.distance > 0;
                        const inGiveRange = selectedTileData.distance !== undefined && 
                                           selectedTileData.distance <= selectedTileData.ownerTank.range;
                        const hasApsToShoot = selectedTileData.ownerTank.aps >= 1;
                        const hasHeartsToGive = selectedTileData.ownerTank.hearts >= 1;
                        
                        const shootDisabledReason = !inShootRange ? `Out of range (${selectedTileData.distance}/${selectedTileData.ownerTank.range})` :
                                                   !hasApsToShoot ? 'Need 1 AP to shoot' : '';
                        const giveDisabledReason = !inGiveRange ? `Out of range (${selectedTileData.distance}/${selectedTileData.ownerTank.range})` :
                                                  !hasHeartsToGive ? 'Need 1 heart to give' : '';
                        
                        return (
                          <div className="space-y-1">
                            <button 
                              className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                              onClick={() => handleShoot(selectedTileData.tank)}
                              disabled={shootLoading || !hasApsToShoot || !inShootRange}
                              title={shootDisabledReason}
                            >
                              {shootLoading ? 'Shooting...' : 'Shoot Tank (1 AP)'}
                            </button>
                            <button 
                              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
                              onClick={() => handleGive(selectedTileData.tank)}
                              disabled={giveLoading || !hasHeartsToGive || !inGiveRange}
                              title={giveDisabledReason}
                            >
                              {giveLoading ? 'Giving...' : 'Give 1 Heart'}
                            </button>
                          </div>
                        );
                      })()}
                      
                      {/* Dead tank message */}
                      {selectedTileData.tank && selectedTileData.tank === selectedTileData.ownerTank && selectedTileData.ownerTank.hearts === 0 && (
                        <div className="text-center text-red-400 text-sm py-2">
                          💀 Your tank has been destroyed
                        </div>
                      )}
                    </div>
                  </div>
              )}
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