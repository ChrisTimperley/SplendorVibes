import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

export class GameController {
  private gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  createGame = async (req: Request, res: Response) => {
    try {
      const { playerName } = req.body;
      const game = await this.gameService.createGame(playerName);
      res.status(201).json(game);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getGame = async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const game = await this.gameService.getGame(gameId);
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
    try {
      const { gameId } = req.params;
      const { playerId, tokens } = req.body;
      const game = await this.gameService.takeTokens(gameId, playerId, tokens);
      res.json(game);
    } catch (error) {
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
