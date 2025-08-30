import { Card, GemType } from '../types/game';

export const cardData: Card[] = [
  // Tier 1 Cards (40 cards)
  {
    id: 'card_1_1',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.DIAMOND,
    cost: { onyx: 3 }
  },
  {
    id: 'card_1_2',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.DIAMOND,
    cost: { onyx: 2, ruby: 1 }
  },
  {
    id: 'card_1_3',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.DIAMOND,
    cost: { emerald: 1, sapphire: 1, onyx: 1 }
  },
  {
    id: 'card_1_4',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.DIAMOND,
    cost: { emerald: 1, sapphire: 2, ruby: 1, onyx: 1 }
  },
  {
    id: 'card_1_5',
    tier: 1,
    prestige: 1,
    gemBonus: GemType.DIAMOND,
    cost: { sapphire: 4 }
  },

  // Sapphire cards
  {
    id: 'card_1_6',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.SAPPHIRE,
    cost: { emerald: 3 }
  },
  {
    id: 'card_1_7',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.SAPPHIRE,
    cost: { emerald: 2, ruby: 1 }
  },
  {
    id: 'card_1_8',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.SAPPHIRE,
    cost: { diamond: 1, emerald: 1, ruby: 1 }
  },
  {
    id: 'card_1_9',
    tier: 1,
    prestige: 0,
    gemBonus: GemType.SAPPHIRE,
    cost: { diamond: 1, emerald: 2, ruby: 1, onyx: 1 }
  },
  {
    id: 'card_1_10',
    tier: 1,
    prestige: 1,
    gemBonus: GemType.SAPPHIRE,
    cost: { ruby: 4 }
  },

  // Tier 2 Cards (30 cards) - Sample
  {
    id: 'card_2_1',
    tier: 2,
    prestige: 1,
    gemBonus: GemType.DIAMOND,
    cost: { emerald: 3, sapphire: 2, onyx: 2 }
  },
  {
    id: 'card_2_2',
    tier: 2,
    prestige: 1,
    gemBonus: GemType.SAPPHIRE,
    cost: { diamond: 2, emerald: 1, ruby: 4 }
  },
  {
    id: 'card_2_3',
    tier: 2,
    prestige: 2,
    gemBonus: GemType.EMERALD,
    cost: { diamond: 2, sapphire: 3, ruby: 3 }
  },
  {
    id: 'card_2_4',
    tier: 2,
    prestige: 2,
    gemBonus: GemType.RUBY,
    cost: { emerald: 5, onyx: 3 }
  },
  {
    id: 'card_2_5',
    tier: 2,
    prestige: 3,
    gemBonus: GemType.ONYX,
    cost: { diamond: 6 }
  },

  // Tier 3 Cards (20 cards) - Sample
  {
    id: 'card_3_1',
    tier: 3,
    prestige: 3,
    gemBonus: GemType.DIAMOND,
    cost: { emerald: 3, sapphire: 3, ruby: 5, onyx: 3 }
  },
  {
    id: 'card_3_2',
    tier: 3,
    prestige: 4,
    gemBonus: GemType.SAPPHIRE,
    cost: { diamond: 3, emerald: 6, ruby: 3 }
  },
  {
    id: 'card_3_3',
    tier: 3,
    prestige: 4,
    gemBonus: GemType.EMERALD,
    cost: { diamond: 7 }
  },
  {
    id: 'card_3_4',
    tier: 3,
    prestige: 5,
    gemBonus: GemType.RUBY,
    cost: { diamond: 3, sapphire: 7 }
  },
  {
    id: 'card_3_5',
    tier: 3,
    prestige: 5,
    gemBonus: GemType.ONYX,
    cost: { emerald: 7, sapphire: 3 }
  }
];

// Note: This is a simplified set. The full game has 90 cards total.
