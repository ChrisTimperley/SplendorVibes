import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Card, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import { gemColors } from '../constants/gemColors';

interface CardComponentProps {
  card: Card;
  onAction: (action: string, payload: any) => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ card, onAction }) => {
  const handlePurchase = () => {
    onAction('purchase-card', { cardId: card.id });
  };

  const handleReserve = () => {
    onAction('reserve-card', { cardId: card.id });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 140,
        height: 200,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${gemColors[card.gemBonus] || colors.divider}`,
        borderRadius: `${borderRadius.xl}px`,
        position: 'relative',
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${colors.background.paper} 0%, ${colors.background.card} 100%)`,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(44, 24, 16, 0.1), 0 2px 4px rgba(44, 24, 16, 0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 32px rgba(44, 24, 16, 0.15), 0 6px 12px rgba(44, 24, 16, 0.1)',
          borderColor: gemColors[card.gemBonus] || colors.primary.main
        }
      }}
    >
      {/* Prestige Points */}
      {card.prestige > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 1,
            right: 1,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.dark} 100%)`,
            border: `2px solid ${colors.secondary.dark}`,
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(218, 165, 32, 0.3)',
            zIndex: 10
          }}
        >
          {card.prestige}
        </Box>
      )}

      {/* Gem Bonus */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: gemColors[card.gemBonus] || colors.divider,
          border: card.gemBonus === GemType.DIAMOND ? '2px solid #999' :
                 card.gemBonus === GemType.ONYX ? '2px solid #555' :
                 `2px solid rgba(255,255,255,0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: card.gemBonus === GemType.DIAMOND ? '#333' :
                 card.gemBonus === GemType.GOLD ? '#000' :
                 card.gemBonus === GemType.ONYX ? '#fff' : 'white',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          mb: 1.5,
          alignSelf: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          background: `linear-gradient(135deg, ${gemColors[card.gemBonus] || colors.divider} 0%, ${gemColors[card.gemBonus] || colors.divider}dd 100%)`
        }}
      >
        {card.gemBonus.charAt(0).toUpperCase()}
      </Box>

      {/* Cost */}
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
          fontSize: '0.7rem',
          color: 'text.primary',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontFamily: '"Inter", sans-serif'
        }}
      >
        Cost
      </Typography>
      <Box sx={{ mb: 1.5, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(card.cost)
          .filter(([_, cost]) => cost > 0)
          .map(([gem, cost]) => (
            <Box
              key={gem}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: gemColors[gem as GemType] || colors.divider,
                color: gem === 'diamond' ? '#333' :
                       gem === 'gold' ? '#000' :
                       gem === 'onyx' ? '#fff' : 'white',
                borderRadius: `${borderRadius.sm}px`,
                px: 1,
                py: 2,
                fontSize: '0.7rem',
                fontWeight: 600,
                minHeight: 18,
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                background: `linear-gradient(90deg, ${gemColors[gem as GemType] || colors.divider} 0%, ${gemColors[gem as GemType] || colors.divider}dd 100%)`
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.7)'
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                {cost}
              </Typography>
            </Box>
          ))
        }
        {Object.values(card.cost).every(cost => cost === 0) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: colors.secondary.light,
              color: colors.secondary.dark,
              borderRadius: `${borderRadius.sm}px`,
              py: 0.5,
              fontStyle: 'italic',
              fontSize: '0.7rem',
              fontWeight: 500
            }}
          >
            Free
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto' }}>
        <Button
          size="small"
          variant="contained"
          onClick={handlePurchase}
          sx={{
            fontSize: '0.65rem',
            py: 0.5,
            minHeight: 28,
            fontWeight: 600,
            borderRadius: `${borderRadius.md}px`,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            '&:hover': {
              transform: 'translateY(-1px)'
            }
          }}
        >
          Buy
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={handleReserve}
          sx={{
            fontSize: '0.65rem',
            py: 0.5,
            minHeight: 28,
            fontWeight: 600,
            borderRadius: `${borderRadius.md}px`,
            borderWidth: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-1px)'
            }
          }}
        >
          Reserve
        </Button>
      </Box>
    </Paper>
  );
};

export default CardComponent;
