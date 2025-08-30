import { Server, Socket } from 'socket.io';
import { GameService } from '../services/gameService';

// Enhanced logging utility
const log = {
  info: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] SOCKET: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] SOCKET ERROR: ${message}`, error ? error.stack || error : '');
  }
};

export class GameSocketHandler {
  private io: Server;
  private gameService: GameService;

  constructor(io: Server) {
    this.io = io;
    this.gameService = new GameService();
  }

  initialize() {
    this.io.on('connection', (socket: Socket) => {
      log.info('Client connected', { socketId: socket.id });

      socket.on('join-game', async (data) => {
        try {
          const { gameId, playerId } = data;
          log.info('Player joining game', { socketId: socket.id, gameId, playerId });
          socket.join(gameId);

          const game = await this.gameService.getGame(gameId);
          socket.emit('game-state', game);
          socket.to(gameId).emit('player-joined', { playerId });
          log.info('Player joined successfully', { socketId: socket.id, gameId, playerId });
        } catch (error) {
          log.error('Failed to join game', { socketId: socket.id, gameId: data?.gameId, error });
          socket.emit('error', { message: (error as Error).message });
        }
      });

      socket.on('leave-game', async (data) => {
        try {
          const { gameId, playerId } = data;
          log.info('Player leaving game', { socketId: socket.id, gameId, playerId });
          socket.leave(gameId);

          socket.to(gameId).emit('player-left', { playerId });
          log.info('Player left successfully', { socketId: socket.id, gameId, playerId });
        } catch (error) {
          log.error('Failed to leave game', { socketId: socket.id, error });
          socket.emit('error', { message: (error as Error).message });
        }
      });

      socket.on('game-action', async (data) => {
        let gameId: string | undefined;
        let action: string | undefined;
        let payload: any;
        
        try {
          ({ gameId, action, payload } = data);
          
          if (!gameId || !action) {
            throw new Error('Missing gameId or action');
          }
          
          log.info('Game action received', { socketId: socket.id, gameId, action, payload });

          let updatedGame;
          switch (action) {
            case 'take-tokens':
              log.info('Processing take-tokens action', { gameId, playerId: payload.playerId, tokens: payload.tokens });
              updatedGame = await this.gameService.takeTokens(gameId, payload.playerId, payload.tokens);
              break;
            case 'purchase-card':
              log.info('Processing purchase-card action', { gameId, playerId: payload.playerId, cardId: payload.cardId });
              updatedGame = await this.gameService.purchaseCard(gameId, payload.playerId, payload.cardId, payload.payment);
              break;
            case 'reserve-card':
              log.info('Processing reserve-card action', { gameId, playerId: payload.playerId, cardId: payload.cardId });
              updatedGame = await this.gameService.reserveCard(gameId, payload.playerId, payload.cardId);
              break;
            default:
              throw new Error('Unknown action');
          }

          log.info('Broadcasting updated game state to all players', { 
            gameId, 
            currentPlayerIndex: updatedGame.currentPlayerIndex,
            gameState: updatedGame.state,
            playerCount: updatedGame.players.length
          });
          this.io.to(gameId).emit('game-state', updatedGame);
        } catch (actionError) {
          log.error('Error processing game action', { 
            gameId: gameId || 'unknown',
            action: action || data?.action || 'unknown',
            playerId: payload?.playerId || 'unknown',
            error: (actionError as Error).message,
            errorStack: (actionError as Error).stack
          });
          socket.emit('error', { message: (actionError as Error).message });
        }
      });

      socket.on('disconnect', () => {
        log.info('Client disconnected', { 
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });
      });
    });
  }
}
