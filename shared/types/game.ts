export enum GemType {
  DIAMOND = 'diamond',
  SAPPHIRE = 'sapphire',
  EMERALD = 'emerald',
  RUBY = 'ruby',
  ONYX = 'onyx',
  GOLD = 'gold'
}

export enum GameState {
  WAITING_FOR_PLAYERS = 'waiting_for_players',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished'
}

export interface TokenBank {
  diamond: number;
  sapphire: number;
  emerald: number;
  ruby: number;
  onyx: number;
  gold: number;
}

export interface Card {
  id: string;
  tier: 1 | 2 | 3;
  prestige: number;
  gemBonus: GemType;
  cost: Partial<TokenBank>;
}

export interface Noble {
  id: string;
  prestige: number;
  requirements: Partial<TokenBank>;
}

export interface Player {
  id: string;
  name: string;
  tokens: TokenBank;
  cards: Card[];
  reservedCards: Card[];
  nobles: Noble[];
  prestige: number;
}

export interface GameBoard {
  availableCards: {
    tier1: Card[];
    tier2: Card[];
    tier3: Card[];
  };
  cardDecks: {
    tier1: Card[];
    tier2: Card[];
    tier3: Card[];
  };
  nobles: Noble[];
  tokens: TokenBank;
}

export interface Game {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  state: GameState;
  board: GameBoard;
  winner?: Player;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameAction {
  type: 'take_tokens' | 'purchase_card' | 'reserve_card';
  playerId: string;
  payload: any;
}
