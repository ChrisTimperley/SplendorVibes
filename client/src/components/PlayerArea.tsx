import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { Player, GemType, Card } from '../../../shared/types/game';
import { borderRadius, colors, animations } from '../theme';
import { gemColors } from '../constants/gemColors';
import ReservedCard from './ReservedCard';
import ReservedCardDialog from './ReservedCardDialog';

interface PlayerAreaProps {
  player: Player;
  isCurrentPlayer: boolean;
  onPurchaseReservedCard?: (cardId: string) => void;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isCurrentPlayer, onPurchaseReservedCard }) => {
  const [prestigeChanged, setPrestigeChanged] = useState(false);
  const [previousPrestige, setPreviousPrestige] = useState(player.prestige);
  const [selectedReservedCard, setSelectedReservedCard] = useState<Card | null>(null);
  const [reservedCardDialogOpen, setReservedCardDialogOpen] = useState(false);

  // Noble qualification "pop" animation trigger
  useEffect(() => {
    if (player.prestige > previousPrestige) {
      setPrestigeChanged(true);
      const timer = setTimeout(() => setPrestigeChanged(false), 500);
      return () => clearTimeout(timer);
    }
    setPreviousPrestige(player.prestige);
  }, [player.prestige, previousPrestige]);

  const handleReservedCardClick = (card: Card) => {
    setSelectedReservedCard(card);
    setReservedCardDialogOpen(true);
  };

  const handlePurchaseReservedCard = (cardId: string) => {
    if (onPurchaseReservedCard) {
      onPurchaseReservedCard(cardId);
    }
    setReservedCardDialogOpen(false);
    setSelectedReservedCard(null);
  };

  const handleCloseReservedCardDialog = () => {
    setReservedCardDialogOpen(false);
    setSelectedReservedCard(null);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2, // Reduced padding for compact view
        border: isCurrentPlayer
          ? `2px solid ${colors.secondary.light}` // Use gold for current player
          : `1px solid rgba(255, 255, 255, 0.2)`, // Light border for sidebar
        bgcolor: isCurrentPlayer
          ? 'rgba(255, 215, 0, 0.1)' // Gold tint for current player
          : 'rgba(255, 255, 255, 0.05)', // Subtle background for sidebar
        borderRadius: `${borderRadius.lg}px`,
        boxShadow: isCurrentPlayer
          ? '0 4px 12px rgba(255, 215, 0, 0.2)'
          : '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: animations.hover,
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: isCurrentPlayer
            ? '0 6px 16px rgba(255, 215, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      {/* Compact prestige display */}
      <Typography
        variant="h5"
        sx={{
          color: colors.secondary.light,
          mb: 2,
          fontWeight: 600,
          transform: prestigeChanged ? 'scale(1.1)' : 'scale(1)',
          transition: animations.popup,
          fontSize: '1.2rem',
        }}
      >
        {player.prestige} Prestige Points
      </Typography>

      {/* Tokens */}
      <Typography variant="h6" sx={{
        mb: 1,
        color: 'white',
        fontWeight: 500,
        fontSize: '0.9rem',
      }}>
        Tokens:
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(player.tokens).map(([gem, count]) => (
          count > 0 && (
            <Chip
              key={gem}
              size="small"
              label={`${count}`}
              sx={{
                bgcolor: gemColors[gem as GemType],
                color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white',
                border: gem === 'diamond' ? '1px solid #ccc' : 'none',
                borderRadius: `${borderRadius.sm}px`,
                fontWeight: 600,
                minWidth: 24,
                height: 24,
                fontSize: '0.75rem',
                transition: animations.hover,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'default',
                },
              }}
            />
          )
        ))}
      </Box>

      {/* Card Bonuses */}
      <Typography variant="h6" sx={{
        mb: 1,
        color: 'white',
        fontWeight: 500,
        fontSize: '0.9rem',
      }}>
        Card Bonuses:
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(
          player.cards.reduce((acc, card) => {
            acc[card.gemBonus] = (acc[card.gemBonus] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([gem, count]) => (
          <Chip
            key={gem}
            size="small"
            label={`${count}`}
            variant="outlined"
            sx={{
              borderColor: gemColors[gem as GemType],
              color: gemColors[gem as GemType],
              borderRadius: `${borderRadius.sm}px`,
              borderWidth: 1.5,
              fontWeight: 600,
              minWidth: 24,
              height: 24,
              fontSize: '0.75rem',
              transition: animations.hover,
              '&:hover': {
                borderColor: gemColors[gem as GemType],
                backgroundColor: `${gemColors[gem as GemType]}15`,
                transform: 'scale(1.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'default',
              }
            }}
          />
        ))}
      </Box>

      {/* Reserved Cards */}
      {player.reservedCards.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{
            mb: 1,
            color: 'white',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}>
            Reserved Cards: {player.reservedCards.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {player.reservedCards.map((card) => (
              <ReservedCard
                key={card.id}
                card={card}
                onClick={handleReservedCardClick}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Nobles */}
      {player.nobles.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{
            mb: 1,
            color: colors.secondary.light, // Use gold color for better visibility
            fontWeight: 500,
            fontSize: '0.9rem',
          }}>
            Nobles: {player.nobles.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {player.nobles.map((noble) => (
              <Chip
                key={noble.id}
                size="small"
                label={`${noble.prestige} pts`}
                sx={{
                  bgcolor: colors.secondary.main,
                  color: 'black',
                  borderRadius: `${borderRadius.sm}px`,
                  fontWeight: 600,
                  height: 24,
                  fontSize: '0.75rem',
                  transition: animations.hover,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    cursor: 'default',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Reserved Card Purchase Dialog */}
      <ReservedCardDialog
        open={reservedCardDialogOpen}
        card={selectedReservedCard}
        onClose={handleCloseReservedCardDialog}
        onPurchase={handlePurchaseReservedCard}
        canPurchase={isCurrentPlayer} // Only allow purchase if it's the current player's turn
      />
    </Paper>
  );
};

export default PlayerArea;
