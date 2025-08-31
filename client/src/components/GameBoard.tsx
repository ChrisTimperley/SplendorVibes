import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { GameBoard as GameBoardType, Card } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import GameCard from './GameCard';
import NobleComponent from './NobleComponent';
import TokenBank from './TokenBank';
import CardActionDialog from './CardActionDialog';

interface GameBoardProps {
  board: GameBoardType;
  onCardAction: (action: string, payload: any) => void;
  selectedTokens: any;
  onTokenSelectionChange: (tokens: any) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCardAction,
  selectedTokens,
  onTokenSelectionChange
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);

  // Use DevCard dimensions (220x300)
  const cardSize = { width: 220, height: 300 };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setCardDialogOpen(true);
  };

  const handleCardDialogClose = () => {
    setCardDialogOpen(false);
    setSelectedCard(null);
  };

  const handlePurchaseCard = (cardId: string) => {
    onCardAction('purchase-card', { cardId });
  };

  const handleReserveCard = (cardId: string) => {
    onCardAction('reserve-card', { cardId });
  };

  const getTierColors = (tier: number) => {
    switch (tier) {
      case 3: // Blue for Tier III
        return {
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          border: '#0d47a1',
          text: '#ffffff',
          pattern: 'rgba(255, 255, 255, 0.1)'
        };
      case 2: // Gold/Yellow for Tier II
        return {
          background: 'linear-gradient(135deg, #ffd700 0%, #ff8f00 100%)',
          border: '#e65100',
          text: '#4a2c2a',
          pattern: 'rgba(0, 0, 0, 0.1)'
        };
      case 1: // Green for Tier I
        return {
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          border: '#1b5e20',
          text: '#ffffff',
          pattern: 'rgba(255, 255, 255, 0.1)'
        };
      default:
        return {
          background: `linear-gradient(135deg, ${colors.background.parchment} 0%, ${colors.background.card} 100%)`,
          border: colors.divider,
          text: colors.text.secondary,
          pattern: colors.divider
        };
    }
  };

  const DeckPlaceholder: React.FC<{ count: number; tier: number }> = ({ count, tier }) => {
    const tierColors = getTierColors(tier);

    return (
      <Box
        sx={{
          width: cardSize.width,
          height: cardSize.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: tierColors.background,
          border: `2px solid ${tierColors.border}`,
          borderRadius: `${borderRadius.xl}px`,
          position: 'relative',
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '15%',
            right: '15%',
            bottom: '20%',
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              ${tierColors.pattern} 8px,
              ${tierColors.pattern} 10px
            )`,
            opacity: 0.3,
            borderRadius: `${borderRadius.md}px`
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 'bold',
            mb: 1,
            color: tierColors.text,
            fontSize: '2rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            zIndex: 2
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: tierColors.text,
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            zIndex: 2,
            mb: 2
          }}
        >
          Cards<br />Remaining
        </Typography>

        {/* Tier label at bottom */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            color: tierColors.text,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontVariant: 'small-caps',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            zIndex: 2
          }}
        >
          Tier {tier === 1 ? 'I' : tier === 2 ? 'II' : 'III'}
        </Typography>

        {/* Decorative corner elements */}
        {[0, 1, 2, 3].map(corner => (
          <Box
            key={corner}
            sx={{
              position: 'absolute',
              width: 12,
              height: 12,
              ...(corner === 0 && { top: 8, left: 8 }),
              ...(corner === 1 && { top: 8, right: 8 }),
              ...(corner === 2 && { bottom: 8, left: 8 }),
              ...(corner === 3 && { bottom: 8, right: 8 }),
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '2px',
                bgcolor: tierColors.border,
                ...(corner < 2 ? { top: 0 } : { bottom: 0 })
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '2px',
                height: '100%',
                bgcolor: tierColors.border,
                ...(corner % 2 === 0 ? { left: 0 } : { right: 0 })
              }
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Nobles Section */}
      <Box>
        <Typography
          variant="h2"
          sx={{
            mb: 3,
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            fontSize: '2.2rem'
          }}
        >
          Nobles
        </Typography>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize.width}px, 1fr))`,
          gap: 2,
          justifyItems: 'center',
          px: 2
        }}>
          {board.nobles.map((noble) => (
            <NobleComponent key={noble.id} noble={noble} />
          ))}
        </Box>
      </Box>

      {/* Development Cards Section */}
      <Box>
        <Typography
          variant="h2"
          sx={{
            mb: 4,
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            fontSize: '2.2rem'
          }}
        >
          Development Cards
        </Typography>

        {[3, 2, 1].map((tier) => (
          <Box key={tier} sx={{ mb: 4 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize.width}px, 1fr))`,
              gap: 2,
              justifyItems: 'center',
              px: 2
            }}>
              {board.availableCards[`tier${tier}` as keyof typeof board.availableCards].map((card) => (
                <GameCard
                  key={card.id}
                  card={card}
                  onCardSelect={handleCardSelect}
                />
              ))}

              {/* Tier-styled deck placeholder */}
              <DeckPlaceholder
                count={board.cardDecks[`tier${tier}` as keyof typeof board.cardDecks].length}
                tier={tier}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Token Bank Section */}
      <Box>
        <TokenBank
          tokens={board.tokens}
          selectedTokens={selectedTokens}
          onTokenSelectionChange={onTokenSelectionChange}
        />
      </Box>

      {/* Card Action Dialog */}
      <CardActionDialog
        open={cardDialogOpen}
        card={selectedCard}
        onClose={handleCardDialogClose}
        onPurchase={handlePurchaseCard}
        onReserve={handleReserveCard}
      />
    </Box>
  );
};

export default GameBoard;
