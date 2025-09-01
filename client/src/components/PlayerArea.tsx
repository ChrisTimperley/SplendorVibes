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
          mb: 1.5, // Reduced from 2
          fontWeight: 600,
          transform: prestigeChanged ? 'scale(1.1)' : 'scale(1)',
          transition: animations.popup,
          fontSize: '1.1rem', // Reduced from 1.2rem
        }}
      >
        {player.prestige} Prestige Points
      </Typography>

      {/* Buying Power */}
      <Typography variant="h6" sx={{
        mb: 0.75, // Reduced from 1
        color: 'white',
        fontWeight: 500,
        fontSize: '0.85rem', // Reduced from 0.9rem
      }}>
        Buying Power:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}> {/* Reduced from 2 */}
        {(['diamond', 'sapphire', 'emerald', 'ruby', 'onyx', 'gold'] as GemType[]).map((gem) => {
          const tokens = player.tokens[gem] || 0;
          const bonuses = player.cards.filter(card => card.gemBonus === gem).length;
          const total = tokens + bonuses;
          
          // Only show gems where the player has some buying power
          if (total === 0) return null;
          
          return (
            <Box
              key={gem}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 0.5,
                borderRadius: `${borderRadius.sm}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Gem icon/color indicator */}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: gemColors[gem],
                  border: gem === 'diamond' ? '1px solid #ccc' : 'none',
                  flexShrink: 0,
                }}
              />
              
              {/* Gem name */}
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  minWidth: 50,
                  flexShrink: 0,
                }}
              >
                {gem}
              </Typography>
              
              {/* Total buying power with breakdown */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  sx={{
                    color: colors.secondary.light,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    minWidth: 20,
                    textAlign: 'center',
                  }}
                >
                  {total}
                </Typography>
                
                {/* Breakdown in parentheses if both tokens and bonuses exist */}
                {tokens > 0 && bonuses > 0 && (
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}
                  >
                    ({tokens}+{bonuses})
                  </Typography>
                )}
              </Box>
              
              {/* Visual breakdown: tokens + bonuses */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                {tokens > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.6rem',
                        fontWeight: 500,
                      }}
                    >
                      T:
                    </Typography>
                    <Chip
                      size="small"
                      label={tokens}
                      sx={{
                        bgcolor: gemColors[gem],
                        color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white',
                        fontWeight: 600,
                        minWidth: 20,
                        height: 16,
                        fontSize: '0.6rem',
                        '& .MuiChip-label': {
                          px: 0.4,
                        },
                      }}
                    />
                  </Box>
                )}
                
                {bonuses > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.6rem',
                        fontWeight: 500,
                      }}
                    >
                      C:
                    </Typography>
                    <Chip
                      size="small"
                      label={bonuses}
                      variant="outlined"
                      sx={{
                        borderColor: gemColors[gem],
                        color: gemColors[gem],
                        fontWeight: 600,
                        minWidth: 20,
                        height: 16,
                        fontSize: '0.6rem',
                        borderWidth: 1.5,
                        '& .MuiChip-label': {
                          px: 0.4,
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
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
                onClick={onPurchaseReservedCard ? handleReservedCardClick : undefined}
                disabled={!onPurchaseReservedCard}
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
