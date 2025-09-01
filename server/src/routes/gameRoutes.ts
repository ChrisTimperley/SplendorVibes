import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { GameService } from '../services/gameService';

export default function gameRoutes(gameService: GameService): Router {
  const router = Router();
  const gameController = new GameController(gameService);

  // Game management routes
  router.post('/', gameController.createGame);
  router.get('/:gameId', gameController.getGame);
  router.post('/:gameId/join', gameController.joinGame);
  router.post('/:gameId/leave', gameController.leaveGame);
  router.get('/', gameController.listGames);

  // Game action routes
  router.post('/:gameId/actions/take-tokens', gameController.takeTokens);
  router.post('/:gameId/actions/purchase-card', gameController.purchaseCard);
  router.post('/:gameId/actions/reserve-card', gameController.reserveCard);
  router.post('/:gameId/actions/purchase-reserved-card', gameController.purchaseReservedCard);
  
  // End game route
  router.post('/:gameId/end', gameController.endGame);

  return router;
}
