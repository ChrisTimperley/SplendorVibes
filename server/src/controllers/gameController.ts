import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

// Enhanced logging utility
const log = {
  info: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] CONTROLLER: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] CONTROLLER ERROR: ${message}`, error ? error.stack || error : '');
  }
};

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  createGame = async (req: Request, res: Response) => {
    try {
      const { playerName } = req.body;
      log.info('Creating new game', { playerName });
      const game = await this.gameService.createGame(playerName);
      log.info('Game created successfully', { gameId: game.id, playerId: game.players[0].id });
      res.status(201).json(game);
    } catch (error) {
      log.error('Failed to create game', error);
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      log.info('Getting game', { gameId });
      const game = await this.gameService.getGame(gameId);
      log.info('Game retrieved successfully', { gameId, playerCount: game.players.length });
      res.json(game);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };

  joinGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerName } = req.body;
      const game = await this.gameService.joinGame(gameId, playerName);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  leaveGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;
      const game = await this.gameService.leaveGame(gameId, playerId);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  listGames = async (req: Request, res: Response) => {
    try {
      const games = await this.gameService.listGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  takeTokens = async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { playerId, tokens } = req.body;
    
    try {
      log.info('Take tokens action', { gameId, playerId, tokens });
      const game = await this.gameService.takeTokens(gameId, playerId, tokens);
      log.info('Tokens taken successfully', { 
        gameId, 
        playerId, 
        tokens, 
        currentPlayer: game.currentPlayerIndex,
        playerTokens: game.players.find(p => p.id === playerId)?.tokens,
        boardTokens: game.board.tokens
      });
      res.json(game);
    } catch (error) {
      log.error('Failed to take tokens', { gameId, playerId, tokens, error });
      res.status(400).json({ error: (error as Error).message });
    }
  };

  purchaseCard = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerId, cardId, payment } = req.body;
      const game = await this.gameService.purchaseCard(gameId, playerId, cardId, payment);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  reserveCard = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { playerId, cardId } = req.body;
      const game = await this.gameService.reserveCard(gameId, playerId, cardId);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
}
