import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { Player, GemType } from '../../../shared/types/game';
import { gemColors } from '../constants/gemColors';

interface PlayerAreaProps {
  player: Player;
  isCurrentPlayer: boolean;
  isActivePlayer: boolean;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ player, isCurrentPlayer, isActivePlayer }) => {
  return (
    <Paper
      elevation={isCurrentPlayer ? 4 : 2}
      sx={{
        p: 2,
        border: isCurrentPlayer ? '2px solid #1976d2' : 'none',
        bgcolor: isActivePlayer ? 'rgba(25, 118, 210, 0.1)' : 'inherit'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {isActivePlayer && <strong style={{ color: '#1976d2' }}>You: </strong>}
        {player.name} {isCurrentPlayer && '(Current Turn)'}
      </Typography>

      <Typography variant="h5" color="primary" gutterBottom>
        {player.prestige} Prestige Points
      </Typography>

      {/* Tokens */}
      <Typography variant="subtitle2" gutterBottom>
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
                border: gem === 'diamond' ? '1px solid #ccc' : 'none'
              }}
            />
          )
        ))}
      </Box>

      {/* Card Bonuses */}
      <Typography variant="subtitle2" gutterBottom>
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
              color: gemColors[gem as GemType]
            }}
          />
        ))}
      </Box>

      {/* Reserved Cards */}
      {player.reservedCards.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Reserved Cards: {player.reservedCards.length}
          </Typography>
        </>
      )}

      {/* Nobles */}
      {player.nobles.length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Nobles: {player.nobles.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {player.nobles.map((noble) => (
              <Chip
                key={noble.id}
                size="small"
                label={`${noble.prestige} pts`}
                sx={{ bgcolor: 'gold', color: 'black' }}
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PlayerArea;
