import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './gameEngine';

describe('GameEngine', () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  describe('initializeBoard', () => {
    it('should create a board with correct token counts for 2 players', () => {
      const board = gameEngine.initializeBoard(2);

      expect(board.tokens.diamond).toBe(4);
      expect(board.tokens.sapphire).toBe(4);
      expect(board.tokens.emerald).toBe(4);
      expect(board.tokens.ruby).toBe(4);
      expect(board.tokens.onyx).toBe(4);
      expect(board.tokens.gold).toBe(5); // Gold is always 5
    });

    it('should create a board with correct token counts for 3 players', () => {
      const board = gameEngine.initializeBoard(3);

      expect(board.tokens.diamond).toBe(5);
      expect(board.tokens.sapphire).toBe(5);
      expect(board.tokens.emerald).toBe(5);
      expect(board.tokens.ruby).toBe(5);
      expect(board.tokens.onyx).toBe(5);
      expect(board.tokens.gold).toBe(5);
    });

    it('should create a board with correct token counts for 4 players', () => {
      const board = gameEngine.initializeBoard(4);

      expect(board.tokens.diamond).toBe(7);
      expect(board.tokens.sapphire).toBe(7);
      expect(board.tokens.emerald).toBe(7);
      expect(board.tokens.ruby).toBe(7);
      expect(board.tokens.onyx).toBe(7);
      expect(board.tokens.gold).toBe(5);
    });

    it('should default to 4 player token counts when no player count is provided', () => {
      const board = gameEngine.initializeBoard();

      expect(board.tokens.diamond).toBe(7);
      expect(board.tokens.sapphire).toBe(7);
      expect(board.tokens.emerald).toBe(7);
      expect(board.tokens.ruby).toBe(7);
      expect(board.tokens.onyx).toBe(7);
      expect(board.tokens.gold).toBe(5);
    });

    it('should create available cards for each tier', () => {
      const board = gameEngine.initializeBoard();

      expect(board.availableCards.tier1).toHaveLength(4);
      expect(board.availableCards.tier2).toHaveLength(4);
      expect(board.availableCards.tier3).toHaveLength(4);
    });

    it('should have remaining cards in the decks', () => {
      const board = gameEngine.initializeBoard();

      expect(board.cardDecks.tier1.length).toBeGreaterThan(0);
      expect(board.cardDecks.tier2.length).toBeGreaterThan(0);
      expect(board.cardDecks.tier3.length).toBeGreaterThan(0);
    });

    it('should initialize nobles as empty array', () => {
      const board = gameEngine.initializeBoard();

      expect(board.nobles).toEqual([]);
    });
  });
});
