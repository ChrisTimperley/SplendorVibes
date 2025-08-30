import { Router } from 'express';
import { GameController } from '../controllers/gameController';

const router = Router();
const gameController = new GameController();

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

export default router;
