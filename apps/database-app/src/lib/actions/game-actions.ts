'use server';

import { db } from '@/lib/db';
import { games, players, tanks, hearts, gameEvents } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { GameSettings, GameState, HexPosition, GameRules, HexUtils } from '@tact/game-logic';

export async function createGame(settings: GameSettings, creator: string) {
  const gameId = uuidv4();
  
  try {
    const gameData = {
      id: gameId,
      address: `0x${gameId.replace(/-/g, '').substring(0, 40)}`, // Mock address
      state: GameState.WaitingForPlayers,
      owner: creator,
      playerCount: settings.playerCount,
      boardSize: settings.boardSize,
      epochSeconds: settings.epochSeconds,
      revealWaitBlocks: settings.revealWaitBlocks,
      initHearts: settings.initHearts,
      initAps: settings.initAps,
      initRange: settings.initRange,
      entryCost: settings.entryCost,
      minPlayers: settings.minPlayers,
      maxPlayers: settings.maxPlayers,
      epochMaxActionPoints: settings.epochMaxActionPoints,
    };

    console.log('Attempting to insert game with data:', gameData);
    
    await db.insert(games).values(gameData);

    // Create game event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'GameCreated',
      player: creator,
      data: { settings },
    });

    revalidatePath('/games');
    return { success: true, gameId };
  } catch (error) {
    console.error('Error creating game:', error);
    return { success: false, error: 'Failed to create game' };
  }
}

export async function joinGame(gameId: string, playerId: string, playerName: string) {
  try {
    // Get game and check if player can join
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game) {
      return { success: false, error: 'Game not found' };
    }

    if (game.state !== GameState.WaitingForPlayers) {
      return { success: false, error: 'Game is not accepting players' };
    }

    if (game.playersCount >= game.maxPlayers) {
      return { success: false, error: 'Game is full' };
    }

    // Check if player already joined
    const existingPlayer = await db.query.players.findFirst({
      where: and(eq(players.gameId, gameId), eq(players.address, playerId)),
    });

    if (existingPlayer) {
      return { success: false, error: 'Player already joined' };
    }

    const tankId = uuidv4();
    const playerDbId = uuidv4();
    
    // Get random starting position
    const startingPosition = HexUtils.getRandomPosition(game.boardSize);
    
    // Create player
    await db.insert(players).values({
      id: playerDbId,
      gameId,
      address: playerId,
      name: playerName,
      tankId,
    });

    // Create tank
    await db.insert(tanks).values({
      id: uuidv4(),
      gameId,
      tankId,
      owner: playerId,
      hearts: game.initHearts,
      aps: game.initAps,
      range: game.initRange,
      positionQ: startingPosition.x,
      positionR: startingPosition.y,
      positionS: startingPosition.z,
      playerName,
    });

    // Update game player count
    await db.update(games)
      .set({ playersCount: game.playersCount + 1 })
      .where(eq(games.id, gameId));

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'PlayerJoined',
      player: playerId,
      data: { playerName, tankId, position: startingPosition },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true, tankId };
  } catch (error) {
    console.error('Error joining game:', error);
    return { success: false, error: 'Failed to join game' };
  }
}

export async function movePlayer(gameId: string, playerId: string, targetPosition: HexPosition) {
  try {
    // Get player's tank
    const tank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, playerId)),
    });

    if (!tank) {
      return { success: false, error: 'Tank not found' };
    }

    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game || game.state !== GameState.Started) {
      return { success: false, error: 'Game is not active' };
    }

    // Get all occupied positions
    const allTanks = await db.query.tanks.findMany({
      where: eq(tanks.gameId, gameId),
    });

    const occupiedPositions = allTanks.map(t => ({ x: t.positionQ, y: t.positionR, z: t.positionS }));
    
    // Validate move
    const currentPosition = { x: tank.positionQ, y: tank.positionR, z: tank.positionS };
    const canMove = GameRules.canMove(
      {
        tankId: tank.tankId,
        owner: tank.owner,
        hearts: tank.hearts,
        aps: tank.aps,
        range: tank.range,
        position: currentPosition,
        playerName: tank.playerName || undefined,
      },
      targetPosition,
      game.boardSize,
      occupiedPositions
    );

    if (!canMove.valid) {
      return { success: false, error: canMove.reason };
    }

    // Update tank position and APs
    await db.update(tanks)
      .set({ 
        positionQ: targetPosition.x,
        positionR: targetPosition.y,
        positionS: targetPosition.z,
        aps: tank.aps - 1,
      })
      .where(eq(tanks.id, tank.id));

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'Move',
      player: playerId,
      data: { 
        from: currentPosition,
        to: targetPosition,
        apsCost: 1,
      },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Error moving player:', error);
    return { success: false, error: 'Failed to move player' };
  }
}

export async function shootPlayer(gameId: string, shooterId: string, targetId: string) {
  try {
    // Get shooter's tank
    const shooterTank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, shooterId)),
    });

    // Get target tank
    const targetTank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, targetId)),
    });

    if (!shooterTank || !targetTank) {
      return { success: false, error: 'Tank not found' };
    }

    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game || game.state !== GameState.Started) {
      return { success: false, error: 'Game is not active' };
    }

    // Validate shoot
    const canShoot = GameRules.canShoot(
      {
        tankId: shooterTank.tankId,
        owner: shooterTank.owner,
        hearts: shooterTank.hearts,
        aps: shooterTank.aps,
        range: shooterTank.range,
        position: { x: shooterTank.positionQ, y: shooterTank.positionR, z: shooterTank.positionS },
        playerName: shooterTank.playerName || undefined,
      },
      {
        tankId: targetTank.tankId,
        owner: targetTank.owner,
        hearts: targetTank.hearts,
        aps: targetTank.aps,
        range: targetTank.range,
        position: { x: targetTank.positionQ, y: targetTank.positionR, z: targetTank.positionS },
        playerName: targetTank.playerName || undefined,
      }
    );

    if (!canShoot.valid) {
      return { success: false, error: canShoot.reason };
    }

    const damage = GameRules.calculateDamage(
      {
        tankId: shooterTank.tankId,
        owner: shooterTank.owner,
        hearts: shooterTank.hearts,
        aps: shooterTank.aps,
        range: shooterTank.range,
        position: { x: shooterTank.positionQ, y: shooterTank.positionR, z: shooterTank.positionS },
        playerName: shooterTank.playerName || undefined,
      },
      {
        tankId: targetTank.tankId,
        owner: targetTank.owner,
        hearts: targetTank.hearts,
        aps: targetTank.aps,
        range: targetTank.range,
        position: { x: targetTank.positionQ, y: targetTank.positionR, z: targetTank.positionS },
        playerName: targetTank.playerName || undefined,
      }
    );

    // Update shooter's APs
    await db.update(tanks)
      .set({ aps: shooterTank.aps - 1 })
      .where(eq(tanks.id, shooterTank.id));

    // Update target's hearts
    const newHearts = Math.max(0, targetTank.hearts - damage);
    await db.update(tanks)
      .set({ hearts: newHearts })
      .where(eq(tanks.id, targetTank.id));

    // Update player alive status if killed
    if (newHearts === 0) {
      await db.update(players)
        .set({ isAlive: false })
        .where(and(eq(players.gameId, gameId), eq(players.address, targetId)));
    }

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'Shoot',
      player: shooterId,
      data: { 
        shooter: shooterId,
        target: targetId,
        damage,
        targetPosition: { x: targetTank.positionQ, y: targetTank.positionR, z: targetTank.positionS },
      },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Error shooting player:', error);
    return { success: false, error: 'Failed to shoot player' };
  }
}

export async function upgradePlayer(gameId: string, playerId: string) {
  try {
    // Get player's tank
    const tank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, playerId)),
    });

    if (!tank) {
      return { success: false, error: 'Tank not found' };
    }

    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game || game.state !== GameState.Started) {
      return { success: false, error: 'Game is not active' };
    }

    // Validate upgrade
    const canUpgrade = GameRules.canUpgrade({
      tankId: tank.tankId,
      owner: tank.owner,
      hearts: tank.hearts,
      aps: tank.aps,
      range: tank.range,
      position: { x: tank.positionQ, y: tank.positionR, z: tank.positionS },
      playerName: tank.playerName || undefined,
    });

    if (!canUpgrade.valid) {
      return { success: false, error: canUpgrade.reason };
    }

    const cost = canUpgrade.cost!;
    const newRange = tank.range + 1;

    // Update tank
    await db.update(tanks)
      .set({ 
        range: newRange,
        aps: tank.aps - cost,
      })
      .where(eq(tanks.id, tank.id));

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'Upgrade',
      player: playerId,
      data: { 
        player: playerId,
        newRange,
        apsCost: cost,
      },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Error upgrading player:', error);
    return { success: false, error: 'Failed to upgrade player' };
  }
}

export async function startGame(gameId: string) {
  try {
    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game) {
      return { success: false, error: 'Game not found' };
    }

    if (game.state !== GameState.WaitingForPlayers) {
      return { success: false, error: 'Game cannot be started' };
    }

    const canStart = GameRules.canStartGame(
      {
        playerCount: game.playerCount,
        boardSize: game.boardSize,
        epochSeconds: game.epochSeconds,
        revealWaitBlocks: game.revealWaitBlocks,
        initHearts: game.initHearts,
        initAps: game.initAps,
        initRange: game.initRange,
        entryCost: game.entryCost,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
        epochMaxActionPoints: game.epochMaxActionPoints,
      },
      game.playersCount
    );

    if (!canStart.valid) {
      return { success: false, error: canStart.reason };
    }

    // Update game state
    const epochStart = new Date();
    await db.update(games)
      .set({ 
        state: GameState.Started,
        epochStart,
      })
      .where(eq(games.id, gameId));

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'GameStarted',
      data: { epochStart },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Error starting game:', error);
    return { success: false, error: 'Failed to start game' };
  }
}

export async function giveToPlayer(
  gameId: string, 
  giverId: string, 
  receiverId: string, 
  hearts?: number, 
  aps?: number
) {
  try {
    // Get both tanks
    const giverTank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, giverId)),
    });

    const receiverTank = await db.query.tanks.findFirst({
      where: and(eq(tanks.gameId, gameId), eq(tanks.owner, receiverId)),
    });

    if (!giverTank || !receiverTank) {
      return { success: false, error: 'Tank not found' };
    }

    // Get game
    const game = await db.query.games.findFirst({
      where: eq(games.id, gameId),
    });

    if (!game || game.state !== GameState.Started) {
      return { success: false, error: 'Game is not active' };
    }

    // Validate give
    const canGive = GameRules.canGive(
      {
        tankId: giverTank.tankId,
        owner: giverTank.owner,
        hearts: giverTank.hearts,
        aps: giverTank.aps,
        range: giverTank.range,
        position: { x: giverTank.positionQ, y: giverTank.positionR, z: giverTank.positionS },
        playerName: giverTank.playerName || undefined,
      },
      {
        tankId: receiverTank.tankId,
        owner: receiverTank.owner,
        hearts: receiverTank.hearts,
        aps: receiverTank.aps,
        range: receiverTank.range,
        position: { x: receiverTank.positionQ, y: receiverTank.positionR, z: receiverTank.positionS },
        playerName: receiverTank.playerName || undefined,
      },
      hearts || 0,
      aps || 0
    );

    if (!canGive.valid) {
      return { success: false, error: canGive.reason };
    }

    // Update both tanks
    const newGiverHearts = giverTank.hearts - (hearts || 0);
    const newGiverAps = giverTank.aps - (aps || 0);
    const newReceiverHearts = receiverTank.hearts + (hearts || 0);
    const newReceiverAps = receiverTank.aps + (aps || 0);

    await db.update(tanks)
      .set({ hearts: newGiverHearts, aps: newGiverAps })
      .where(eq(tanks.id, giverTank.id));

    await db.update(tanks)
      .set({ hearts: newReceiverHearts, aps: newReceiverAps })
      .where(eq(tanks.id, receiverTank.id));

    // Create event
    await db.insert(gameEvents).values({
      id: uuidv4(),
      gameId,
      type: 'Give',
      player: giverId,
      data: { 
        giver: giverId,
        receiver: receiverId,
        hearts: hearts || 0,
        aps: aps || 0,
      },
    });

    revalidatePath(`/games/${gameId}`);
    return { success: true };
  } catch (error) {
    console.error('Error giving to player:', error);
    return { success: false, error: 'Failed to give to player' };
  }
}