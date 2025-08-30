import { v4 as uuidv4 } from 'uuid';
import { Game, Player, GameState } from '../../../shared/types/game';
import { GameEngine } from '../../../shared/game/gameEngine';

export class GameService {
  private games: Map<string, Game> = new Map();
  private gameEngine: GameEngine;

  constructor() {
    this.gameEngine = new GameEngine();
  }

  async createGame(playerName: string): Promise<Game> {
    const gameId = uuidv4();
    const playerId = uuidv4();

    const player: Player = {
      id: playerId,
      name: playerName,
      tokens: { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0 },
      cards: [],
      reservedCards: [],
      nobles: [],
      prestige: 0
    };

    const game: Game = {
      id: gameId,
      players: [player],
      currentPlayerIndex: 0,
      state: GameState.WAITING_FOR_PLAYERS,
      board: this.gameEngine.initializeBoard(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.games.set(gameId, game);
    return game;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async joinGame(gameId: string, playerName: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.players.length >= 4) {
      throw new Error('Game is full');
    }

    if (game.state !== GameState.WAITING_FOR_PLAYERS) {
      throw new Error('Game has already started');
    }

    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      name: playerName,
      tokens: { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0 },
      cards: [],
      reservedCards: [],
      nobles: [],
      prestige: 0
    };

    game.players.push(player);
    game.updatedAt = new Date();

    if (game.players.length >= 2) {
      game.state = GameState.IN_PROGRESS;
      // Update nobles based on final player count
      this.gameEngine.updateNoblesForPlayerCount(game);
    }

    this.games.set(gameId, game);
    return game;
  }

  async leaveGame(gameId: string, playerId: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const playerIndex = game.players.findIndex((p: Player) => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found in game');
    }

    game.players.splice(playerIndex, 1);
    game.updatedAt = new Date();

    if (game.players.length < 2) {
      game.state = GameState.WAITING_FOR_PLAYERS;
    }

    if (game.players.length === 0) {
      this.games.delete(gameId);
    } else {
      this.games.set(gameId, game);
    }

    return game;
  }

  async listGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async takeTokens(gameId: string, playerId: string, tokens: any): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const updatedGame = this.gameEngine.takeTokens(game, playerId, tokens);
    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async purchaseCard(gameId: string, playerId: string, cardId: string, payment: any): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const updatedGame = this.gameEngine.purchaseCard(game, playerId, cardId, payment);
    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  async reserveCard(gameId: string, playerId: string, cardId: string): Promise<Game> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const updatedGame = this.gameEngine.reserveCard(game, playerId, cardId);
    this.games.set(gameId, updatedGame);
    return updatedGame;
  }
}
