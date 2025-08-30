import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Card, GemType } from '../../../shared/types/game';

interface CardComponentProps {
  card: Card;
  onPurchase: () => void;
  onReserve: () => void;
}

const gemColors = {
  [GemType.DIAMOND]: '#f8f8ff',
  [GemType.SAPPHIRE]: '#0066cc',
  [GemType.EMERALD]: '#00cc66',
  [GemType.RUBY]: '#cc0000',
  [GemType.ONYX]: '#2c2c2c',
  [GemType.GOLD]: '#ffcc00'
};

const CardComponent: React.FC<CardComponentProps> = ({ card, onPurchase, onReserve }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 140,
        height: 200,
        p: 1.2,
        display: 'flex',
        flexDirection: 'column',
        border: `3px solid ${gemColors[card.gemBonus] || '#ccc'}`,
        borderRadius: 2,
        position: 'relative',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        overflow: 'hidden',
        '&:hover': {
          elevation: 6,
          transform: 'translateY(-3px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Prestige Points */}
      {card.prestige > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: '2px solid #FF8C00',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(255, 165, 0, 0.4)',
            zIndex: 10
          }}
        >
          {card.prestige}
        </Box>
      )}

      {/* Gem Bonus */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: gemColors[card.gemBonus] || '#ccc',
          border: card.gemBonus === GemType.DIAMOND ? '2px solid #999' :
                 card.gemBonus === GemType.ONYX ? '2px solid #555' : '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: card.gemBonus === GemType.DIAMOND ? '#333' :
                 card.gemBonus === GemType.GOLD ? '#000' :
                 card.gemBonus === GemType.ONYX ? '#fff' : 'white',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          mb: 1,
          alignSelf: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          background: `linear-gradient(135deg, ${gemColors[card.gemBonus] || '#ccc'} 0%, ${gemColors[card.gemBonus] || '#ccc'}cc 100%)`
        }}
      >
        {card.gemBonus.charAt(0).toUpperCase()}
      </Box>

      {/* Cost */}
      <Typography
        variant="caption"
        sx={{
          mb: 0.5,
          fontWeight: 600,
          fontSize: '0.65rem',
          color: 'text.primary',
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}
      >
        Cost
      </Typography>
      <Box sx={{ mb: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {Object.entries(card.cost)
          .filter(([_, cost]) => cost > 0)
          .map(([gem, cost]) => (
            <Box
              key={gem}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: gemColors[gem as GemType] || '#ccc',
                color: gem === 'diamond' ? '#333' :
                       gem === 'gold' ? '#000' :
                       gem === 'onyx' ? '#fff' : 'white',
                borderRadius: 1,
                px: 0.6,
                py: 0.2,
                fontSize: '0.65rem',
                fontWeight: 600,
                minHeight: 18,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                background: `linear-gradient(90deg, ${gemColors[gem as GemType] || '#ccc'} 0%, ${gemColors[gem as GemType] || '#ccc'}dd 100%)`
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.6)'
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.65rem' }}>
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
              bgcolor: 'success.light',
              color: 'success.dark',
              borderRadius: 1,
              py: 0.3,
              fontStyle: 'italic',
              fontSize: '0.65rem'
            }}
          >
            Free
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 'auto' }}>
        <Button
          size="small"
          variant="contained"
          onClick={onPurchase}
          sx={{
            fontSize: '0.6rem',
            py: 0.4,
            minHeight: 24,
            fontWeight: 600,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Buy
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onReserve}
          sx={{
            fontSize: '0.6rem',
            py: 0.4,
            minHeight: 24,
            fontWeight: 600,
            borderRadius: 1.5,
            borderWidth: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            '&:hover': {
              borderWidth: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
