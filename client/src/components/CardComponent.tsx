import React from 'react';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Card, GemType } from '../../../shared/types/game';

interface CardComponentProps {
  card: Card;
  onPurchase: () => void;
  onReserve: () => void;
}

const gemColors = {
  [GemType.DIAMOND]: '#ffffff',
  [GemType.SAPPHIRE]: '#0066cc',
  [GemType.EMERALD]: '#00cc66',
  [GemType.RUBY]: '#cc0000',
  [GemType.ONYX]: '#333333',
  [GemType.GOLD]: '#ffcc00'
};

const CardComponent: React.FC<CardComponentProps> = ({ card, onPurchase, onReserve }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        width: 120,
        height: 160,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        border: `3px solid ${gemColors[card.gemBonus]}`,
        position: 'relative'
      }}
    >
      {/* Prestige Points */}
      {card.prestige > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'gold',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          {card.prestige}
        </Box>
      )}

      {/* Gem Bonus */}
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          bgcolor: gemColors[card.gemBonus],
          border: card.gemBonus === GemType.DIAMOND ? '2px solid #ccc' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: card.gemBonus === GemType.DIAMOND || card.gemBonus === GemType.GOLD ? 'black' : 'white',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          mb: 1
        }}
      >
        {card.gemBonus.charAt(0).toUpperCase()}
      </Box>

      {/* Cost */}
      <Typography variant="caption" sx={{ mb: 1 }}>
        Cost:
      </Typography>
      <Box sx={{ mb: 1, flexGrow: 1 }}>
        {Object.entries(card.cost).map(([gem, cost]) => (
          <Chip
            key={gem}
            size="small"
            label={`${cost} ${gem.charAt(0).toUpperCase()}`}
            sx={{
              fontSize: '0.6rem',
              height: 16,
              mb: 0.5,
              mr: 0.5,
              bgcolor: gemColors[gem as GemType],
              color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white'
            }}
          />
        ))}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Button
          size="small"
          variant="contained"
          onClick={onPurchase}
          sx={{ fontSize: '0.6rem', py: 0.25 }}
        >
          Buy
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onReserve}
          sx={{ fontSize: '0.6rem', py: 0.25 }}
        >
          Reserve
        </Button>
      </Box>
    </Paper>
  );
};

export default CardComponent;
