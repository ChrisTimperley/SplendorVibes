import { Server, Socket } from 'socket.io';
import { GameService } from '../services/gameService';

export class GameSocketHandler {
  private io: Server;
  private gameService: GameService;

  constructor(io: Server) {
    this.io = io;
    this.gameService = new GameService();
  }

  initialize() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('join-game', async (data) => {
        try {
          const { gameId, playerId } = data;
          socket.join(gameId);

          const game = await this.gameService.getGame(gameId);
          socket.emit('game-state', game);
          socket.to(gameId).emit('player-joined', { playerId });
        } catch (error) {
          socket.emit('error', { message: (error as Error).message });
        }
      });

      socket.on('leave-game', async (data) => {
        try {
          const { gameId, playerId } = data;
          socket.leave(gameId);

          socket.to(gameId).emit('player-left', { playerId });
        } catch (error) {
          socket.emit('error', { message: (error as Error).message });
        }
      });

      socket.on('game-action', async (data) => {
        try {
          const { gameId, action, payload } = data;

          let updatedGame;
          switch (action) {
            case 'take-tokens':
              updatedGame = await this.gameService.takeTokens(gameId, payload.playerId, payload.tokens);
              break;
            case 'purchase-card':
              updatedGame = await this.gameService.purchaseCard(gameId, payload.playerId, payload.cardId, payload.payment);
              break;
            case 'reserve-card':
              updatedGame = await this.gameService.reserveCard(gameId, payload.playerId, payload.cardId);
              break;
            default:
              throw new Error('Unknown action');
          }

          this.io.to(gameId).emit('game-state', updatedGame);
        } catch (error) {
          socket.emit('error', { message: (error as Error).message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}
