import { Game, Player, GameBoard, Card, Noble, TokenBank, GemType, GameState } from '../types/game';
import { cardData } from '../data/cards';
import { nobleData } from '../data/nobles';

export class GameEngine {

  initializeBoard(playerCount?: number): GameBoard {
    const allCards = [...cardData];

    // Shuffle cards
    this.shuffleArray(allCards);

    // Separate cards by tier
    const tier1Cards = allCards.filter(card => card.tier === 1);
    const tier2Cards = allCards.filter(card => card.tier === 2);
    const tier3Cards = allCards.filter(card => card.tier === 3);

    return {
      availableCards: {
        tier1: tier1Cards.splice(0, 4),
        tier2: tier2Cards.splice(0, 4),
        tier3: tier3Cards.splice(0, 4)
      },
      cardDecks: {
        tier1: tier1Cards,
        tier2: tier2Cards,
        tier3: tier3Cards
      },
      nobles: [], // Nobles will be set when game starts
      tokens: {
        diamond: 7,
        sapphire: 7,
        emerald: 7,
        ruby: 7,
        onyx: 7,
        gold: 5
      }
    };
  }

  updateNoblesForPlayerCount(game: Game): void {
    const playerCount = game.players.length;
    const allNobles = [...nobleData];

    // Shuffle nobles
    this.shuffleArray(allNobles);

    // Determine number of nobles based on player count
    let nobleCount = 5; // Default for 4 players
    if (playerCount === 2) {
      nobleCount = 3;
    } else if (playerCount === 3) {
      nobleCount = 4;
    }

    // Update the game board with the correct number of nobles
    game.board.nobles = allNobles.splice(0, nobleCount);
  }

  takeTokens(game: Game, playerId: string, tokens: Partial<TokenBank>): Game {
    const player = this.getPlayer(game, playerId);

    if (!this.isPlayerTurn(game, playerId)) {
      throw new Error('Not your turn');
    }

    if (!this.isValidTokenTake(tokens, game.board.tokens)) {
      throw new Error('Invalid token selection');
    }

    // Take tokens from board
    Object.entries(tokens).forEach(([gem, count]) => {
      if (count && count > 0) {
        game.board.tokens[gem as keyof TokenBank] -= count;
        player.tokens[gem as keyof TokenBank] += count;
      }
    });

    this.nextTurn(game);
    game.updatedAt = new Date();

    return game;
  }

  purchaseCard(game: Game, playerId: string, cardId: string, payment?: Partial<TokenBank>): Game {
    const player = this.getPlayer(game, playerId);

    if (!this.isPlayerTurn(game, playerId)) {
      throw new Error('Not your turn');
    }

    const card = this.findCard(game, cardId);
    if (!card) {
      throw new Error('Card not found');
    }

    // Auto-calculate payment if not provided
    if (!payment) {
      payment = this.calculateMinimumPayment(player, card);
    }

    if (!this.canAffordCard(player, card, payment)) {
      throw new Error('Cannot afford card');
    }

    // Pay for card (payment is guaranteed to be defined here)
    this.payForCard(game, player, payment!);

    // Add card to player
    player.cards.push(card);
    player.prestige += card.prestige;

    // Remove card from board and replace if possible
    this.removeCardFromBoard(game, card);

    // Check for noble visits
    this.checkNobleVisits(game, player);

    // Check win condition
    if (player.prestige >= 15) {
      game.state = GameState.FINISHED;
      game.winner = player;
    }

    this.nextTurn(game);
    game.updatedAt = new Date();

    return game;
  }

  reserveCard(game: Game, playerId: string, cardId: string): Game {
    const player = this.getPlayer(game, playerId);

    if (!this.isPlayerTurn(game, playerId)) {
      throw new Error('Not your turn');
    }

    if (player.reservedCards.length >= 3) {
      throw new Error('Cannot reserve more than 3 cards');
    }

    const card = this.findCard(game, cardId);
    if (!card) {
      throw new Error('Card not found');
    }

    // Add card to reserved cards
    player.reservedCards.push(card);

    // Give gold token if available
    if (game.board.tokens.gold > 0) {
      player.tokens.gold += 1;
      game.board.tokens.gold -= 1;
    }

    // Remove card from board
    this.removeCardFromBoard(game, card);

    this.nextTurn(game);
    game.updatedAt = new Date();

    return game;
  }

  purchaseReservedCard(game: Game, playerId: string, cardId: string, payment?: Partial<TokenBank>): Game {
    const player = this.getPlayer(game, playerId);

    if (!this.isPlayerTurn(game, playerId)) {
      throw new Error('Not your turn');
    }

    // Find the card in the player's reserved cards
    const cardIndex = player.reservedCards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card is not in your reserved cards');
    }

    const card = player.reservedCards[cardIndex];

    // Calculate payment if not provided
    if (!payment) {
      payment = this.calculateMinimumPayment(player, card);
    }

    // Check if player can afford the card
    if (!this.canAffordCard(player, card, payment)) {
      throw new Error('Cannot afford this card');
    }

    // Pay for the card
    this.payForCard(game, player, payment);

    // Remove card from reserved cards
    player.reservedCards.splice(cardIndex, 1);

    // Add card to player's purchased cards
    player.cards.push(card);
    player.prestige += card.prestige;

    // Check for noble visits
    this.checkNobleVisits(game, player);

    // Check for win condition
    if (player.prestige >= 15) {
      // Mark game as finished but don't end immediately
      // The game will end after all players have had equal turns
      game.state = GameState.FINISHED;
      game.winner = player;
    }

    this.nextTurn(game);
    game.updatedAt = new Date();

    return game;
  }

  private getPlayer(game: Game, playerId: string): Player {
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  }

  private isPlayerTurn(game: Game, playerId: string): boolean {
    return game.players[game.currentPlayerIndex].id === playerId;
  }

  private isValidTokenTake(tokens: Partial<TokenBank>, availableTokens: TokenBank): boolean {
    const selectedGems = Object.entries(tokens).filter(([gem, count]) => 
      count && count > 0 && gem !== 'gold' // Gold cannot be taken directly
    );

    if (selectedGems.length === 0) return false;

    // Rule 1: Take 3 different gems
    if (selectedGems.length === 3) {
      return selectedGems.every(([gem, count]) =>
        count === 1 && availableTokens[gem as keyof TokenBank] >= 1
      );
    }

    // Rule 2: Take 2 of the same gem (if 4+ available)
    if (selectedGems.length === 1) {
      const [gem, count] = selectedGems[0];
      return count === 2 && availableTokens[gem as keyof TokenBank] >= 4;
    }

    return false;
  }

  private canAffordCard(player: Player, card: Card, payment?: Partial<TokenBank>): boolean {
    // Calculate player's buying power (tokens + card bonuses)
    const playerGems = { ...player.tokens };

    // Add gem bonuses from owned cards
    player.cards.forEach(ownedCard => {
      if (ownedCard.gemBonus) {
        playerGems[ownedCard.gemBonus] = (playerGems[ownedCard.gemBonus] || 0) + 1;
      }
    });

    // If no payment specified, auto-calculate if card is affordable
    if (!payment) {
      let goldNeeded = 0;
      
      for (const [gem, cost] of Object.entries(card.cost)) {
        if (cost && cost > 0) {
          const available = playerGems[gem as keyof TokenBank] || 0;
          const shortfall = Math.max(0, cost - available);
          goldNeeded += shortfall;
        }
      }
      
      return goldNeeded <= (player.tokens.gold || 0);
    }

    // Validate the specified payment
    return this.isValidPayment(player, card, payment);
  }

  private isValidPayment(player: Player, card: Card, payment: Partial<TokenBank>): boolean {
    // Calculate available resources (tokens + card bonuses)
    const playerGems = { ...player.tokens };
    
    // Add gem bonuses from owned cards
    player.cards.forEach(ownedCard => {
      if (ownedCard.gemBonus) {
        playerGems[ownedCard.gemBonus] = (playerGems[ownedCard.gemBonus] || 0) + 1;
      }
    });

    // Check if player has enough tokens to make the payment
    let totalPaid = 0;
    for (const [gem, amount] of Object.entries(payment)) {
      if (amount && amount > 0) {
        const available = playerGems[gem as keyof TokenBank] || 0;
        if (amount > available) {
          return false; // Not enough tokens to make this payment
        }
        totalPaid += amount;
      }
    }

    // Check if the payment covers the card cost
    let totalCostAfterBonuses = 0;
    for (const [gem, cost] of Object.entries(card.cost)) {
      if (cost && cost > 0) {
        const cardBonuses = player.cards.filter(c => c.gemBonus === gem).length;
        const gemPayment = payment[gem as keyof TokenBank] || 0;
        const effectiveCost = Math.max(0, cost - cardBonuses);
        
        if (gemPayment < effectiveCost) {
          // If not enough specific gems paid, the difference must be covered by gold
          const goldNeeded = effectiveCost - gemPayment;
          totalCostAfterBonuses += goldNeeded;
        }
      }
    }

    // Check if enough gold is being paid to cover any shortfalls
    const goldPaid = payment.gold || 0;
    return goldPaid >= totalCostAfterBonuses;
  }

  private calculateMinimumPayment(player: Player, card: Card): Partial<TokenBank> {
    const payment: Partial<TokenBank> = {};

    // Calculate player's buying power (tokens + card bonuses)
    const playerGems = { ...player.tokens };

    // Add gem bonuses from owned cards
    player.cards.forEach(ownedCard => {
      if (ownedCard.gemBonus) {
        playerGems[ownedCard.gemBonus] = (playerGems[ownedCard.gemBonus] || 0) + 1;
      }
    });

    let goldNeeded = 0;

    // Calculate minimum payment needed for each gem type
    Object.entries(card.cost).forEach(([gem, cost]) => {
      if (cost && cost > 0) {
        const gemType = gem as keyof TokenBank;
        const cardBonuses = player.cards.filter(c => c.gemBonus === gemType).length;
        const effectiveCost = Math.max(0, cost - cardBonuses);
        
        if (effectiveCost > 0) {
          const availableTokens = player.tokens[gemType] || 0;
          const tokensToUse = Math.min(effectiveCost, availableTokens);
          
          if (tokensToUse > 0) {
            payment[gemType] = tokensToUse;
          }
          
          // Any remaining cost must be paid with gold
          const remaining = effectiveCost - tokensToUse;
          if (remaining > 0) {
            goldNeeded += remaining;
          }
        }
      }
    });

    // Add gold payment if needed
    if (goldNeeded > 0) {
      payment.gold = goldNeeded;
    }

    return payment;
  }

  private payForCard(game: Game, player: Player, payment: Partial<TokenBank>): void {
    Object.entries(payment).forEach(([gem, amount]) => {
      if (amount && amount > 0) {
        player.tokens[gem as keyof TokenBank] -= amount;
        game.board.tokens[gem as keyof TokenBank] += amount;
      }
    });
  }

  private findCard(game: Game, cardId: string): Card | null {
    const allAvailableCards = [
      ...game.board.availableCards.tier1,
      ...game.board.availableCards.tier2,
      ...game.board.availableCards.tier3
    ];

    return allAvailableCards.find(card => card.id === cardId) || null;
  }

  private removeCardFromBoard(game: Game, card: Card): void {
    const tier = card.tier;
    const tierKey = `tier${tier}` as keyof typeof game.board.availableCards;

    const cardIndex = game.board.availableCards[tierKey].findIndex(c => c.id === card.id);
    if (cardIndex !== -1) {
      game.board.availableCards[tierKey].splice(cardIndex, 1);

      // Replace with new card from deck if available
      const deckKey = `tier${tier}` as keyof typeof game.board.cardDecks;
      if (game.board.cardDecks[deckKey].length > 0) {
        const newCard = game.board.cardDecks[deckKey].shift()!;
        game.board.availableCards[tierKey].push(newCard);
      }
    }
  }

  private checkNobleVisits(game: Game, player: Player): void {
    // Calculate player's gem bonuses
    const gemBonuses: Partial<TokenBank> = {};
    player.cards.forEach(card => {
      gemBonuses[card.gemBonus] = (gemBonuses[card.gemBonus] || 0) + 1;
    });

    // Check which nobles can visit
    const eligibleNobles = game.board.nobles.filter(noble =>
      Object.entries(noble.requirements).every(([gem, required]) =>
        (gemBonuses[gem as keyof TokenBank] || 0) >= (required || 0)
      )
    );

    // Player can choose one noble (for simplicity, take the first one)
    if (eligibleNobles.length > 0) {
      const noble = eligibleNobles[0];
      player.nobles.push(noble);
      player.prestige += noble.prestige;

      // Remove noble from board
      const nobleIndex = game.board.nobles.findIndex(n => n.id === noble.id);
      if (nobleIndex !== -1) {
        game.board.nobles.splice(nobleIndex, 1);
      }
    }
  }

  private nextTurn(game: Game): void {
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
