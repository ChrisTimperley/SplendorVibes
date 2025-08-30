import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { Player, GemType } from '../../../shared/types/game';
import { borderRadius, colors } from '../theme';
import { gemColors } from '../constants/gemColors';

interface PlayerAreaProps {
  player: Player;
  isCurrentPlayer: boolean;
  isActivePlayer: boolean;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isCurrentPlayer, isActivePlayer }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: isCurrentPlayer
          ? `2px solid ${colors.primary.main}`
          : `1px solid ${colors.divider}`,
        bgcolor: isActivePlayer
          ? 'rgba(139, 69, 19, 0.05)'
          : 'background.paper',
        borderRadius: `${borderRadius.xl}px`,
        boxShadow: isCurrentPlayer
          ? '0 8px 24px rgba(139, 69, 19, 0.15), 0 4px 8px rgba(139, 69, 19, 0.1)'
          : '0 2px 8px rgba(44, 24, 16, 0.08), 0 1px 2px rgba(44, 24, 16, 0.04)'
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
        {isActivePlayer && <strong style={{ color: colors.primary.main }}>You: </strong>}
        {player.name} {isCurrentPlayer && '(Current Turn)'}
      </Typography>

      <Typography
        variant="h3"
        sx={{
          color: 'primary.main',
          mb: 3,
          fontWeight: 600
        }}
      >
        {player.prestige} Prestige Points
      </Typography>

      {/* Tokens */}
      <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
        Tokens:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {Object.entries(player.tokens).map(([gem, count]) => (
          count > 0 && (
            <Chip
              key={gem}
              size="medium"
              label={`${count}`}
              sx={{
                bgcolor: gemColors[gem as GemType],
                color: gem === 'diamond' || gem === 'gold' ? 'black' : 'white',
                border: gem === 'diamond' ? '1px solid #ccc' : 'none',
                borderRadius: `${borderRadius.md}px`,
                fontWeight: 600,
                minWidth: 36,
                height: 32
              }}
            />
          )
        ))}
      </Box>

      {/* Card Bonuses */}
      <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
        Card Bonuses:
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {Object.entries(
          player.cards.reduce((acc, card) => {
            acc[card.gemBonus] = (acc[card.gemBonus] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([gem, count]) => (
          <Chip
            key={gem}
            size="medium"
            label={`${count}`}
            variant="outlined"
            sx={{
              borderColor: gemColors[gem as GemType],
              color: gemColors[gem as GemType],
              borderRadius: `${borderRadius.md}px`,
              borderWidth: 2,
              fontWeight: 600,
              minWidth: 36,
              height: 32,
              '&:hover': {
                borderColor: gemColors[gem as GemType],
                backgroundColor: `${gemColors[gem as GemType]}15`
              }
            }}
          />
        ))}
      </Box>

      {/* Reserved Cards */}
      {player.reservedCards.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
            Reserved Cards: {player.reservedCards.length}
          </Typography>
        </Box>
      )}

      {/* Nobles */}
      {player.nobles.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
            Nobles: {player.nobles.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {player.nobles.map((noble) => (
              <Chip
                key={noble.id}
                size="medium"
                label={`${noble.prestige} pts`}
                sx={{
                  bgcolor: colors.secondary.main,
                  color: 'black',
                  borderRadius: `${borderRadius.md}px`,
                  fontWeight: 600,
                  height: 32
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PlayerArea;
